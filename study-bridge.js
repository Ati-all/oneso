/* 원소톡톡 상세 학습 연결층
   기존 원소표/퀴즈 기능은 건드리지 않고, 클릭된 원소의 상세 패널을
   긴 학습 카드로 확장합니다. elements-enhanced.js가 먼저 로드되어도
   이 파일이 마지막에 실행되도록 배포 workflow에서 연결합니다. */
(function(){
  const $ = (s)=>document.querySelector(s);
  const esc = (v)=>String(v ?? '').replace(/[&<>\"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const wait = setInterval(()=>{
    const periodic=$('#periodic'), detail=$('#detail');
    if(!periodic || !detail) return;
    clearInterval(wait);

    function getElementFromCell(cell){
      const sym=cell.querySelector('.sym')?.textContent?.trim();
      if(!sym) return null;
      const list=window.elements || window.ELEMENTS || [];
      return list.find(e=>e.symbol===sym) || null;
    }

    function renderStudy(e){
      if(!e) return;
      const category=e.category || e.type || '원소';
      const period=e.period || '-';
      const group=e.group || '-';
      const number=e.number || '-';
      const name=e.name || '';
      const symbol=e.symbol || '';

      const categoryIntro={
        '알칼리 금속':'1족의 금속으로 최외각 전자 1개를 잃기 쉬워 반응성이 큽니다.','알칼리 토금속':'2족 금속으로 +2 이온을 만들기 쉬우며 산화물·탄산염 등 여러 화합물을 형성합니다.','전이 금속':'d 오비탈 전자가 화학적 성질에 관여하여 여러 산화 상태와 착이온, 합금 등을 만들 수 있습니다.','후전이 금속':'금속 결합과 다양한 산화 상태를 바탕으로 합금·전자재료·화학공업에서 활용됩니다.','준금속':'금속과 비금속의 중간 성질을 보여 반도체와 특수 소재에 중요한 경우가 많습니다.','비금속':'공유결합을 다양하게 만들며 대기·물·생물체·광물 등 여러 환경에서 발견됩니다.','할로젠':'17족 원소로 전자 하나를 얻어 안정한 음이온을 만들기 쉬우며 금속과 염을 형성합니다.','비활성 기체':'18족 원소로 전자껍질이 안정해 일반적인 조건에서 화학 반응성이 매우 낮습니다.','란타넘족':'4f 전자가 채워지는 금속 계열로 서로 비슷한 화학적 성질을 보이며 첨단 소재에 중요합니다.','악티늄족':'5f 전자가 채워지는 무거운 금속 계열이며 대부분 방사성이고 핵과학과 관련이 깊습니다.'
      }[category] || '이 원소의 전자 구조와 주기율표에서의 위치가 화학적 성질을 이해하는 중요한 단서입니다.';

      const special={
        H:['수소는 원자번호 1번으로 모든 원소 중 가장 가볍습니다. 우주에서 가장 풍부한 원소이며 별 내부에서는 수소 핵융합이 에너지 생성의 핵심 과정입니다.','지구에서는 자유로운 수소 기체보다 물과 유기 화합물처럼 다른 원소와 결합한 형태가 훨씬 흔합니다.','암모니아 제조, 석유 정제, 반도체 공정, 연료전지와 우주 추진 등에서 사용됩니다.','수소 기체는 공기와 섞이면 쉽게 연소할 수 있으므로 누출과 점화원을 관리해야 합니다.','H = Hydrogen = 가장 가벼운 원소 → H₂O → 별의 에너지.'],
        C:['탄소는 네 개의 공유결합을 만들 수 있어 사슬·고리·복잡한 구조를 매우 다양하게 만들 수 있습니다. 이 성질 때문에 유기화학과 생명과학의 중심 원소입니다.','대기 중 이산화탄소, 생물체, 석회암, 화석연료뿐 아니라 흑연과 다이아몬드 같은 순수 물질로도 존재합니다.','연료, 철강, 활성탄, 흑연 전극, 탄소섬유, 다이아몬드 공구와 첨단 탄소재료 등에 활용됩니다.','탄소 자체의 독성은 형태에 따라 크게 다릅니다. 특히 일산화탄소는 혈액의 산소 운반을 방해하므로 매우 주의해야 합니다.','C = Carbon = 생명체의 골격 + 흑연 + 다이아몬드.'],
        O:['산소는 호흡과 연소, 산화 반응에 핵심적인 비금속입니다. 일반적으로 O₂ 분자로 존재하며 오존 O₃이라는 동소체도 있습니다.','대기의 약 21%가 산소 기체이며 물·광물·생물체에도 산소가 결합된 형태로 매우 풍부합니다.','의료용 산소, 철강 제조, 용접·절단, 수처리와 화학공업 등에 사용됩니다.','고농도 산소는 물질의 연소를 훨씬 쉽게 만들 수 있어 화재 위험을 높입니다.','O = Oxygen = 호흡 + 연소 + 공기 약 21% + 오존.'],
        Fe:['철은 원자번호 26번의 전이 금속으로 철강의 핵심 성분입니다. Fe²⁺와 Fe³⁺처럼 여러 산화 상태를 나타낼 수 있습니다.','자연에서는 적철석·자철석 같은 광석에 산화철 형태로 존재하며 지구 내부에도 매우 풍부합니다.','건축물, 자동차, 기계, 철도, 공구 등 현대 산업의 핵심 소재인 강철 제조에 사용됩니다.','습한 공기에서 산화되어 녹이 생길 수 있습니다. 생명체에서는 헤모글로빈의 중심 금속으로도 중요합니다.','Fe = Ferrum의 Fe + 철강 + 헤모글로빈.'],
        Si:['규소는 대표적인 준금속으로 전기적 성질을 정밀하게 조절할 수 있어 현대 반도체 산업의 핵심입니다.','지각에서는 규산염 광물과 이산화규소 형태로 매우 풍부하며 모래와 석영에서도 규소를 만날 수 있습니다.','컴퓨터 칩, 태양전지, 유리, 세라믹과 실리콘계 소재 등에 사용됩니다.','원소 규소, 이산화규소, 실리콘 고분자는 서로 다른 물질이므로 구별해야 합니다.','Si = Silicon = 반도체 칩 + 모래·석영.'],
        Au:['금은 원자번호 79번의 전이 금속이며 산화와 부식에 매우 강한 귀금속입니다. 전성과 연성이 좋아 아주 얇게 가공할 수 있습니다.','자연에서 금속 상태로 발견되기도 하며 광석에서 다른 물질과 분리하여 얻기도 합니다.','장신구, 전자 접점, 정밀 부품과 특수 소재 등에 사용됩니다.','금속 금은 비교적 안정하지만 금 화합물은 물질에 따라 다른 성질과 위험성을 가질 수 있습니다.','Au는 라틴어 aurum에서 온 기호입니다. Gold와 Au를 함께 기억하세요.'],
        U:['우라늄은 원자번호 92번의 방사성 악티늄족 원소입니다. 여러 동위원소를 가지며 일부는 핵분열과 관련됩니다.','지각의 여러 광물에 소량씩 널리 존재하며 천연 우라늄은 여러 동위원소의 혼합물입니다.','원자력 발전의 연료와 핵과학 연구 등에 사용됩니다.','방사성과 화학적 독성을 함께 고려해야 하므로 전문적인 안전 관리가 필요합니다.','U = 92번 + 악티늄족 + 방사성 + 핵분열.']
      }[symbol];

      const o=special?.[0] || `${name}은(는) 원자번호 ${number}의 ${category} 원소입니다. ${categoryIntro} 주기율표에서 ${period}주기 ${group}족에 위치하며, 이 위치를 전자배치와 함께 보면 단순 암기보다 성질을 이해하기 쉽습니다.`;
      const n=special?.[1] || `${name}은(는) 자연계에서 원소 자체 또는 다른 원소와 결합한 화합물 형태로 존재합니다. 실제 존재 형태는 산화 상태와 주변 환경에 따라 달라지며, 광물·대기·물·생물체 중 어디에서 발견되는지를 살펴보면 원소의 특징을 이해하는 데 도움이 됩니다.`;
      const u=special?.[2] || `${name}의 활용은 ${categoryIntro.toLowerCase()} 산업에서는 이러한 성질을 이용해 합금, 촉매, 전자재료, 화학제품, 에너지·환경 기술 등 다양한 분야에서 사용합니다. 실제 제품에서는 원소 자체뿐 아니라 산화물·염·합금 같은 형태로 사용되는 경우가 많습니다.`;
      const s=special?.[3] || `안전성은 원소 자체뿐 아니라 화학적 형태와 노출량에 따라 달라집니다. 기체·금속·염·산화물은 서로 다른 물질처럼 취급해야 하며, 독성·반응성·방사성을 가진 물질은 적절한 안전 기준에 따라 다뤄야 합니다.`;
      const m=special?.[4] || `${symbol} = ${name} → 원자번호 ${number} → ${period}주기 → ${group}족 → ${category}. 먼저 기호와 이름을 연결한 뒤 대표적인 성질과 활용을 하나씩 붙여 기억해 보세요.`;

      detail.innerHTML=`<div class="detail"><div class="detail-top"><div><div class="big ${category}">${esc(symbol)}</div><h2>${esc(name)}</h2><div class="sub">원자번호 ${esc(number)} · ${esc(category)}</div></div><button class="fav" title="즐겨찾기">☆</button></div><span class="badge">${esc(category)}</span><div class="facts"><div class="fact"><b>원자번호</b><span>${esc(number)}</span></div><div class="fact"><b>주기</b><span>${esc(period)}주기</span></div><div class="fact"><b>족</b><span>${esc(group)}족</span></div><div class="fact"><b>상태</b><span>${esc(e.state||'-')}</span></div></div><div class="box science"><b>🔬 원소를 자세히 알아보기</b><p>${esc(o)}</p></div><div class="box science"><b>⚛️ 원자 구조와 화학적 성질</b><p>${esc(categoryIntro)} 원소의 반응성은 최외각 전자와 전자배치, 그리고 다른 원소와 결합했을 때의 에너지 변화와 밀접하게 관련됩니다.</p></div><div class="box science"><b>🌍 자연에서는 어떻게 존재할까?</b><p>${esc(n)}</p></div><div class="box uses"><b>🛠️ 어디에 사용될까?</b><p>${esc(u)}</p></div><div class="box science"><b>🧬 생명체와의 관계</b><p>${esc(name)}이(가) 생명체에 관여하는 정도는 원소마다 다릅니다. 생체 분자의 구성 성분이 되거나 효소·이온 균형에 관여하는 원소가 있는 반면, 생명체에서 특별한 생물학적 역할이 알려지지 않은 원소도 있습니다. 따라서 '필수 원소인지'와 '어떤 화학 형태인지'를 구분해서 공부하는 것이 중요합니다.</p></div><div class="box science"><b>⚠️ 안전과 주의사항</b><p>${esc(s)}</p></div><div class="box memory"><b>🧠 외우는 방법</b><p>${esc(m)}</p></div><div class="box memory"><b>📌 공부 순서</b><p><strong>${esc(number)}</strong> 원자번호 → <strong>${esc(symbol)}</strong> 기호 → <strong>${esc(category)}</strong> 분류 → 대표 성질 → 대표 활용 순서로 소리 내어 복습해 보세요.</p></div></div>`;
      detail.scrollIntoView({behavior:'smooth',block:'nearest'});
    }

    periodic.addEventListener('click', ev=>{
      const cell=ev.target.closest('.el');
      if(!cell) return;
      setTimeout(()=>{
        const e=getElementFromCell(cell);
        if(e) renderStudy(e);
      },0);
    });
    document.addEventListener('click', ev=>{
      const cell=ev.target.closest('#series .el');
      if(!cell) return;
      setTimeout(()=>{const e=getElementFromCell(cell); if(e) renderStudy(e);},0);
    });
  },50);
})();
