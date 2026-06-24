import React from 'react';
import Navbar from '@/components/portfolio/Navbar';
import Hero from '@/components/portfolio/Hero';
import About from '@/components/portfolio/About';
import Skills from '@/components/portfolio/Skills';
import Projects from '@/components/portfolio/Projects';
import Timeline from '@/components/portfolio/Timeline';
import Testimonials from '@/components/portfolio/Testimonials';
import Contact from '@/components/portfolio/Contact';
import Footer from '@/components/portfolio/Footer';
import CustomCursor from '@/components/portfolio/CustomCursor';

import { getSettings } from '@/app/actions/settings';
import { getProjects } from '@/app/actions/project';
import { getSkills } from '@/app/actions/skill';
import { getExperiences } from '@/app/actions/experience';
import { getTestimonials } from '@/app/actions/testimonial';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const settings = await getSettings();
  const projects = await getProjects();
  const skills = await getSkills();
  const experiences = await getExperiences();
  const testimonials = await getTestimonials();

  return (
    <>
      <CustomCursor />
      <Navbar settings={settings} />
      <main className="w-full flex flex-col pt-[72px]">
        <Hero settings={settings} />
        <About 
          settings={settings} 
          projectsCount={projects.length}
          skillsCount={skills.length}
          experiencesCount={experiences.length}
        />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Timeline experiences={experiences} />
        <Testimonials testimonials={testimonials} />
        <Contact />
      </main>
      <Footer settings={settings} />
    </>
  );
}
