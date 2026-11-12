import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Brands from '@/components/Brands';
import About from '@/components/About';
import ContentCreator from '@/components/ContentCreator';
import ReelEditor from '@/components/ReelEditor';
import Ugc from '@/components/Ugc';
import Interviewer from '@/components/Interviewer';
import Model from '@/components/Model';
import Process from '@/components/Process';
import Footer from '@/components/Footer';
import Clarity from '@/components/Clarity';
import { getContent } from '@/lib/content';

export default async function Home() {
  const { site, nav, header, ugc } = await getContent();
  return (
    <main>
      <Header nav={nav} site={site} header={header} />
      <Hero />
      <Brands />
      <About />
      <ContentCreator />
      <ReelEditor />
      <Ugc data={ugc} />
      <Interviewer />
      <Model />
      <Process />
      <Footer />
      <Clarity />
    </main>
  );
}
