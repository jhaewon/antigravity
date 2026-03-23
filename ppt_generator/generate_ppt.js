const pptxgen = require("pptxgenjs");

let pptx = new pptxgen();
let slide = pptx.addSlide();

// Add title
slide.addText("동적 검증 실무 대시보드 구축 과정 요약", { 
  x: 0, y: 0.3, w: "100%", align: "center", fontSize: 28, bold: true, color: "1E3A8A", fontFace: "Malgun Gothic"
});
slide.addText("단일 HTML 프로토타입 설계부터 다중 버전 조회가 가능한 반응형 React 대시보드로의 전면 개편 프로세스", { 
  x: 0, y: 0.9, w: "100%", align: "center", fontSize: 13, color: "6B7280", fontFace: "Malgun Gothic"
});

// Step 1
slide.addShape(pptx.ShapeType.rect, { x: 0.4, y: 1.6, w: 2.1, h: 2.5, fill: {color: "EEF2FF"}, rectRadius: 0.1 });
slide.addText("Step 1. 요구사항 분석", { x: 0.4, y: 1.7, w: 2.1, align: "center", fontSize: 14, bold: true, color: "312E81", fontFace: "Malgun Gothic" });
slide.addText("• NotebookLM 지식베이스 데이터 파악\n• 요약 시트 분석 (진행률 및 잔여 건수)\n• 핵심 블로커(이슈) 관리 요건 도출\n• 기술스택 확정 (Tailwind, Chart.js)", { x: 0.5, y: 2.3, w: 1.9, fontSize: 12, color: "1F2937", valign: "top", fontFace: "Malgun Gothic" });

// Arrow 1
slide.addShape(pptx.ShapeType.rightArrow, { x: 2.55, y: 2.7, w: 0.3, h: 0.3, fill: {color: "94A3B8"}, line: {color: "ffffff"} });

// Step 2
slide.addShape(pptx.ShapeType.rect, { x: 2.9, y: 1.6, w: 2.1, h: 2.5, fill: {color: "EFF6FF"}, rectRadius: 0.1 });
slide.addText("Step 2. 초기 프로토타입 설계", { x: 2.9, y: 1.7, w: 2.1, align: "center", fontSize: 14, bold: true, color: "1E3A8A", fontFace: "Malgun Gothic" });
slide.addText("• 단일 HTML 기반의 신속한 화면 구성\n• Chart.js 누적 막대 그래프 시각화 적용\n• Tailwind CSS 유틸리티 클래스 스타일링\n• T0020 버전 목표와 현황을 직관적 배치", { x: 3.0, y: 2.3, w: 1.9, fontSize: 12, color: "1F2937", valign: "top", fontFace: "Malgun Gothic" });

// Arrow 2
slide.addShape(pptx.ShapeType.rightArrow, { x: 5.05, y: 2.7, w: 0.3, h: 0.3, fill: {color: "94A3B8"}, line: {color: "ffffff"} });

// Step 3
slide.addShape(pptx.ShapeType.rect, { x: 5.4, y: 1.6, w: 2.1, h: 2.5, fill: {color: "FEF3C7"}, rectRadius: 0.1 });
slide.addText("Step 3. React + Vite 마이그레이션", { x: 5.4, y: 1.7, w: 2.1, align: "center", fontSize: 14, bold: true, color: "78350F", fontFace: "Malgun Gothic" });
slide.addText("• 유지보수성 강화를 위한 모듈 컴포넌트화\n• Header, KPI Cards, 차트, 이슈보드 분리\n• MockData 스토어 중앙 집중화 관리 구축\n• 빠른 렌더링(HMR) 및 현대적 개발 환경 구성", { x: 5.5, y: 2.3, w: 1.9, fontSize: 12, color: "1F2937", valign: "top", fontFace: "Malgun Gothic" });

// Arrow 3
slide.addShape(pptx.ShapeType.rightArrow, { x: 7.55, y: 2.7, w: 0.3, h: 0.3, fill: {color: "94A3B8"}, line: {color: "ffffff"} });

// Step 4
slide.addShape(pptx.ShapeType.rect, { x: 7.9, y: 1.6, w: 2.1, h: 2.5, fill: {color: "ECFDF5"}, rectRadius: 0.1 });
slide.addText("Step 4. 실 데이터 매핑 및 확장", { x: 7.9, y: 1.7, w: 2.1, align: "center", fontSize: 14, bold: true, color: "064E3B", fontFace: "Malgun Gothic" });
slide.addText("• T0020 및 T0010 실 프로젝트 엑셀 반영\n• 다중 데이터 버전을 위한 Header 드롭다운\n• 컴포넌트 간 State 상태관리 체계 고도화\n• 지연/On-Track/특이사항 등 리얼리티 완성", { x: 8.0, y: 2.3, w: 1.9, fontSize: 12, color: "1F2937", valign: "top", fontFace: "Malgun Gothic" });

// Footer
slide.addText("최종 결과물 : 프로젝트 검증 상황을 한눈에 관리하고 리소스 배치를 돕는, 유연한 '모던 웹 대시보드' 확보", { 
  x: 0, y: 4.8, w: "100%", align: "center", fontSize: 16, bold: true, color: "065F46", fontFace: "Malgun Gothic"
});

pptx.writeFile({ fileName: "d:\\antigravity\\Dashboard_Creation_Summary.pptx" }).then(fileName => {
    console.log("created file: " + fileName);
}).catch(err => {
    console.error("error occurred: " + err);
});
