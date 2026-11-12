import { R, Wrap, Title } from '@/lib/ui';
import { getContent } from '@/lib/content';
import ModelGallery from './ModelGallery';

export default async function Model() {
  const { model } = await getContent();
  return (
    <section id="model" className="bg-cream py-16 md:py-24">
      <Wrap>
        <Title sub={model.sub}>{model.title}</Title>
        <R i={2} className="mt-8">
          <ModelGallery photos={model.photos} pageSize={model.pageSize} moreLabel={model.moreLabel} />
        </R>
      </Wrap>
    </section>
  );
}
