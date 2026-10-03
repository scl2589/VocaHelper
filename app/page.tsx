import Link from 'next/link';
export default function Home() {
 return <div className="home-shell">
  <section className="home-hero"><div><p className="section-kicker">A LITTLE EVERY DAY</p><h1>오늘의 단어가,<br/>내일의 자신감으로.</h1><p className="home-intro">읽고, 떠올리고, 다시 만나세요.<br/>나에게 맞는 속도로 쌓아가는 영어 공부.</p><div className="home-actions"><Link className="study-primary" href="/vocabulary/memorize">깜빡이 학습 시작하기 <span>↗</span></Link><Link className="study-secondary" href="/vocabulary">단어 노트 펼치기 →</Link></div></div><div className="sample-note" aria-label="단어 노트 예시"><p className="section-kicker">TODAY’S INSPIRATION · 예시 단어</p><h2>steady</h2><p><span>형용사</span> 꾸준한, 한결같은</p><div className="sample-rule"/><blockquote>Small steps, steady progress.</blockquote><p className="sample-translation">작은 걸음으로, 꾸준히 앞으로.</p></div></section>
  <section aria-labelledby="study-path"><div className="home-section-heading"><h2 id="study-path">오늘은 어떻게 공부할까요?</h2><span>나만의 학습 루틴</span></div><div className="study-options">{[
   ['01','읽으며 익히기','단어 노트','뜻을 가리고 하나씩 떠올려 보세요.','/vocabulary'],
   ['02','반복하며 기억하기','깜빡이 학습','고정된 시선으로, 나에게 맞는 횟수만큼.','/vocabulary/memorize'],
   ['03','기억을 확인하기','단어 퀴즈','아는 단어와 헷갈리는 단어를 확인해요.','/vocabulary/quiz']
  ].map(([number,caption,title,description,href])=><Link className="study-option" href={href} key={href}><div><span>{number}</span><small>{caption}</small></div><h3>{title} <span>↗</span></h3><p>{description}</p></Link>)}</div></section>
  <section className="home-import"><div><h2>공부할 단어를 준비해 보세요.</h2><p>나만의 단어장을 만들거나, 엑셀 파일로 한 번에 가져올 수 있어요.</p></div><Link className="study-secondary" href="/vocabulary/add/excel">엑셀로 가져오기 →</Link></section>
 </div>;
}
