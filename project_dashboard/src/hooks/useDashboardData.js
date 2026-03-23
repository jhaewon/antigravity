import { useState, useEffect } from 'react';
import { dashboardData as fallbackData, versions as fallbackVersions } from '../data/mockData';

// 환경 변수(.env)에서 구글 API 키와 스프레드시트 ID를 가져옵니다.
// VITE_ 접두어가 붙어야 클라이언트(브라우저)에서 접근 가능합니다.
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;

// 연동할 시트 이름(탭 이름) 목록
const SHEET_NAMES = [
  '2-1. Dynamic_Verification_Summ', // 요약 시트 탭 이름
  '2. Dynamic_Verification'       // 로그 시트 탭 이름
];

// 구글 API 응답(2차원 배열)을 CSV 파싱과 유사한 객체 배열로 매핑하는 헬퍼 함수
const mapRowsToObjects = (values) => {
  if (!values || values.length === 0) return [];
  const headers = values[0]; // 첫 번째 행은 컬럼명(Header)
  return values.slice(1).map((row) => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });
};

// 단일 시트 데이터 로드 API 호출 함수
const fetchSheetData = async (sheetName) => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}?key=${API_KEY}`;

  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Google API Error: ${errorData.error?.message || response.statusText}`);
  }

  const json = await response.json();
  // 2-1 Summary 시트처럼 다층 헤더인 경우 rawValues가 필요하므로 원본 배열도 함께 반환
  return { rawValues: json.values || [], mappedObjects: mapRowsToObjects(json.values) };
};

// 동적 파싱 매퍼 (Mapper): 평면 데이터 -> 입체적 대시보드 구조 (버전별, KPI, 차트, 이슈)
const transformGoogleSheetData = (sheetsData) => {
  // 1. 요약 시트(2-1. Summ)와 일일 로그(2. Verification) 분리
  const summRaw = sheetsData[0]?.data?.rawValues || []; // 첫 번째 시트 원시 데이터
  const logSheet = sheetsData[1]?.data?.mappedObjects || []; // 두 번째 시트 매핑 객체

  const newDashboardData = {};

  // 데이터에 존재하는 유일한 '버전' 추출 (로그 시트 기준)
  const allVersions = [...new Set(logSheet.map(r => r['버전']).filter(Boolean))];

  // 요약 시트에서 버전별 블록 나누기 (순차 탐색)
  const summBlocks = {};
  let currentSummVersion = null;

  summRaw.forEach(row => {
    // 버전 텍스트가 포함된 첫 번째 텍스트 셀을 버전 헤더로 인식
    const matched = allVersions.find(v => row.some(cell => typeof cell === 'string' && cell.includes(v)));
    if (matched) {
      currentSummVersion = matched;
      if (!summBlocks[currentSummVersion]) summBlocks[currentSummVersion] = [];
    }
    if (currentSummVersion) {
      summBlocks[currentSummVersion].push(row);
    }
  });

  // 버전별 순회
  allVersions.forEach(version => {
    // ---- [파트 1: 이슈 트래커 추출 (로그 시트 활용)] ----
    const versionLogs = logSheet.filter(r => r['버전'] === version);
    const issues = [];
    versionLogs.forEach((row, idx) => {
      const remark = row['특이사항'];
      if (!remark || remark.trim() === '') return;

      const isBlocker = /(불가|지연|오류|문제|크리티컬|이슈)/.test(remark);
      const isWarning = /(추가|변경|검토|요청)/.test(remark);

      if (isBlocker || isWarning) {
        issues.push({
          id: `${version}_ISSUE_${idx}`,
          type: isBlocker ? 'Blocker' : 'Warning',
          dateRange: row['날짜'],
          title: `[${row['서브시스템'] || '공통'}] 요주의 항목 발생`,
          description: `(${row['담당자']}) ${remark}`,
          impact: [{ label: "업무 구분", value: row['업무 구분'], isDanger: isBlocker }]
        });
      }
    });
    issues.reverse();

    // ---- [파트 2: KPI 및 차트 추출 (요약 시트 활용 - 해당 버전 블록만 가져오기)] ----
    const chartLabels = [];
    const completedData = [];
    const remainingData = [];
    const bgColors = [];
    const bottleneckNames = [];

    let kpiTotal = 0;
    let kpiCompleted = 0;
    let kpiTargetDate = "일정 미상";

    // 현재 버전용 파싱 블록
    const summForVersion = summBlocks[version] || [];

    // 요약 시트에서 목표 일정 파싱 ("실무 일정")
    for (const row of summForVersion) {
      // 띄어쓰기 여부와 무관하게 '실무일정' 텍스트를 포함하는 셀 탐색
      const cellIndex = row.findIndex(cell => typeof cell === 'string' && cell.replace(/\s+/g, '').includes('실무일정'));

      if (cellIndex !== -1) {
        const textCell = row[cellIndex];
        // 1. 같은 셀 안에 "실무 일정: 2026.03.13" 처럼 날짜가 표기되어 있는지 정규식 탐색
        const dateMatch = textCell.match(/\d{4}[-./]\d{1,2}[-./]\d{1,2}/);

        if (dateMatch) {
          kpiTargetDate = dateMatch[0];
        } else {
          // 2. 만약 글자와 날짜가 서로 다른 두 칸(셀)에 나뉘어 있다면 오른쪽 셀을 가져옵니다.
          kpiTargetDate = String(row[cellIndex + 1] || '').trim() || "일정 미상";
        }
        break;
      }
    }

    // 통상적인 서브시스템 목록 패턴 매칭
    const knownSubsystems = ['Dd', 'Dp', 'Md', 'Op', 'Pt', 'Rs', 'So', 'Tqm', 'Ts', 'Vs'];

    summForVersion.forEach(row => {
      // 행 배열 내부에 서브시스템 라벨이 존재하는지 검사 (보통 1번 혹은 2번 인덱스에 존재 'Layers')
      const subIndex = row.findIndex(v => typeof v === 'string' && knownSubsystems.includes(v.trim()));

      if (subIndex !== -1) {
        const sub = row[subIndex].trim();
        // NotebookLM 분석 결과:
        // 서브시스템 바로 우측(+1)이 "검증대상", +3이 "검증완료", +4가 "진행률" 임
        const targetStr = row[subIndex + 1] || '0';
        const completedStr = row[subIndex + 3] || '0';
        const progressStr = String(row[subIndex + 4] || '0%');

        const target = Number(targetStr.replace(/[^0-9.]/g, '')) || 0;
        const completed = Number(completedStr.replace(/[^0-9.]/g, '')) || 0;
        const progressNum = Number(progressStr.replace(/[^0-9.]/g, '')) || 0;

        const remaining = Math.max(0, target - completed); // 잔여 = 대상 - 완료

        chartLabels.push(sub);
        completedData.push(completed);
        remainingData.push(remaining);

        kpiTotal += target;
        kpiCompleted += completed;

        // 병목 판별 로직 수정 (문자열 포함 검사가 아닌 실제 숫자 === 0 검사)
        const isBottleneck = target > 0 && (completed === 0 || progressNum === 0);
        bgColors.push(isBottleneck ? '#ef4444' : '#6366f1');

        if (isBottleneck) {
          bottleneckNames.push(sub);
        }
      }
    });

    const progress = kpiTotal > 0 ? (kpiCompleted / kpiTotal) * 100 : 0;
    
    let status = 'On-Track';
    // 100% 도달 시 "완료" 상태 부여, 미만이고 50% 아래면 Delayed
    if (progress >= 100) {
      status = '완료';
    } else if (progress < 50 && kpiTotal > 0) {
      status = 'Delayed';
    }

    // 완성된 객체 조립
    newDashboardData[version] = {
      bottlenecks: bottleneckNames,
      kpi: {
        total: kpiTotal,
        completed: kpiCompleted,
        remaining: Math.max(0, kpiTotal - kpiCompleted),
        progress: parseFloat(progress.toFixed(2)),
        status: status,
        targetDate: kpiTargetDate,
        currentDate: new Date().toLocaleDateString('ko-KR')
      },
      chart: {
        labels: chartLabels,
        datasets: [
          {
            label: "완료 (Completed)",
            data: completedData,
            backgroundColor: bgColors,
            borderWidth: 0,
            borderRadius: 4
          },
          {
            label: "잔여 (Remaining)",
            data: remainingData,
            backgroundColor: "#e5e7eb",
            borderWidth: 0,
            borderRadius: 4
          }
        ]
      },
      issues: issues.slice(0, 10)
    };
  });

  const newVersions = Object.keys(newDashboardData).sort((a, b) => b.localeCompare(a));
  if (newVersions.length === 0) return null;

  return { dashboardData: newDashboardData, versions: newVersions };
};

export const useDashboardData = () => {
  const [data, setData] = useState(null);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 환경 변수가 제대로 설정되지 않은 경우 방어 코드 (임시 데이터 렌더링)
        if (!API_KEY || !SPREADSHEET_ID || API_KEY.includes('API_키')) {
          console.warn("⚠️ 환경 변수(.env)에 API 키와 시트 ID가 설정되지 않았습니다. 기본 임시 데이터를 렌더링합니다.");
          setData(fallbackData);
          setVersions(fallbackVersions);
          setLoading(false);
          return;
        }

        // 정의된 여러 시트(탭)를 병렬(동시)로 API 호출하여 가져옵니다.
        const results = await Promise.all(
          SHEET_NAMES.map(async (sheetName) => {
            const parsedData = await fetchSheetData(sheetName);
            return { sheetName, data: parsedData };
          })
        );

        console.log("구글 시트 API 연동 원본 데이터 (객체 변환됨):", results);

        // 🎇 데이터 변환 로직 (Mapper) 실행
        const transformed = transformGoogleSheetData(results);

        if (transformed && transformed.versions.length > 0) {
          setData(transformed.dashboardData);
          setVersions(transformed.versions);
        } else {
          // 시트에 아직 버전 정보가 없거나 비어있는 경우
          console.warn("데이터 매핑 결과가 비어있습니다. 임시 데이터를 노출합니다.");
          setData(fallbackData);
          setVersions(fallbackVersions);
        }

      } catch (e) {
        console.error("데이터 패칭 실패:", e);
        setError("데이터를 불러오는데 실패했습니다: " + e.message);
        setData(fallbackData);
        setVersions(fallbackVersions);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, versions, loading, error };
};
