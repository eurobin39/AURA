const ScarfAidPage = () => {
    return (
      <div className="bg-gray-100 p-6 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">AURA - 최신 분석 로그</h1>
        <div className="space-y-4">
          <div className="bg-yellow-400 p-6 rounded-lg">11:00 - 집중력 저하 감지 (피로도 80%)</div>
          <div className="bg-white p-4 rounded-lg shadow">10:30 - 마우스 활동 감소</div>
          <div className="bg-white p-4 rounded-lg shadow">10:00 - 키보드 입력 정상</div>
        </div>
      </div>
    );
  };
  
  export default ScarfAidPage;