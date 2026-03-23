export const dashboardData = {
  "T0020": {
    "kpi": {
      "total": 1333,
      "completed": 782,
      "remaining": 551,
      "progress": 58.66,
      "status": "Delayed",
      "targetDate": "2026.03.13",
      "currentDate": "2026.03.16"
    },
    "chart": {
      "labels": ["Dd", "Dp", "Md", "Op", "Pt", "Rs", "So", "Tqm", "Ts", "Vs"],
      "datasets": [
        {
          "label": "완료 (Completed)",
          "data": [45, 0, 19, 19, 79, 7, 140, 280, 45, 148],
          "backgroundColor": ['#6366f1', '#ef4444', '#f87171', '#6366f1', '#6366f1', '#6366f1', '#6366f1', '#6366f1', '#6366f1', '#6366f1'],
          "borderWidth": 0,
          "borderRadius": 4
        },
        {
          "label": "잔여 (Remaining)",
          "data": [203, 29, 109, 0, 210, 0, 0, 0, 0, 0],
          "backgroundColor": "#e5e7eb",
          "borderWidth": 0,
          "borderRadius": 4
        }
      ]
    },
    "issues": [
      {
        "id": "T0020_ISSUE_01",
        "type": "Blocker",
        "dateRange": "26.03.04 - 26.03.09",
        "title": "VDI 접속 불가",
        "description": "Vs(황지원), Pt(이혜윤) 서브시스템 담당자의 VDI 접속 불가로 인해 동적 검증 업무 진행 불가",
        "impact": [
          {
            "label": "진행률",
            "value": "업무 지연(0%)",
            "isDanger": true
          }
        ]
      },
      {
        "id": "T0020_ISSUE_02",
        "type": "Warning",
        "dateRange": "26.03.03",
        "title": "모델 추가 반영",
        "description": "TrsmstCmbSig 모델 추가 반영",
        "impact": [
          {
            "label": "요구사항 추가",
            "value": "+20건",
            "isDanger": false
          }
        ]
      }
    ]
  },
  "T0010": {
    "kpi": {
      "total": 170,
      "completed": 35,
      "remaining": 135,
      "progress": 20.59,
      "status": "On-Track",
      "targetDate": "",
      "currentDate": "2026.02.19"
    },
    "chart": {
      "labels": ["Dd"],
      "datasets": [
        {
          "label": "완료 (Completed)",
          "data": [35],
          "backgroundColor": ['#6366f1'],
          "borderWidth": 0,
          "borderRadius": 4
        },
        {
          "label": "잔여 (Remaining)",
          "data": [135],
          "backgroundColor": "#e5e7eb",
          "borderWidth": 0,
          "borderRadius": 4
        }
      ]
    },
    "issues": []
  }
};

// 키 값을 버림차순으로 정렬 (예: T0020이 맨 앞)
export const versions = Object.keys(dashboardData).sort((a, b) => b.localeCompare(a));
