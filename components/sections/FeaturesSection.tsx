import FeatureCard from '@/components/FeatureCard';
import { FEATURES } from '@/data/features';

export default function FeaturesSection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            모든 학습 도구가 한 곳에
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            단어 추가부터 암기까지, 학습에 필요한 모든 기능을 제공합니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.href}
              href={feature.href}
              iconType={feature.iconType}
              title={feature.title}
              description={feature.description}
              color={feature.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
