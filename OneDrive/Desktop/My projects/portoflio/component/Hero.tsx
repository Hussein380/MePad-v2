import React from 'react';
import { Spotlight } from './ui/spotlight';
import { TextGenerateEffect } from './ui/TextGenerateEffect';
import MagicButton from './ui/MagicButton';
import { FaLocationArrow } from 'react-icons/fa';

const Hero = () => {
    return (
        <div className='pb-20 pt-36'>
            <div>
                <Spotlight className="h-screen -top-40 -left-10 md:-left-32 md:-top-20" fill='white' />
                <Spotlight className="-top-10 -left-fill h-[80vh] w-[50vw]" fill='purple' />
                <Spotlight className="-top-28 -left-80 h-[80vh] w-[50vh]" fill='blue' />
            </div>

            <div className="h-screen w-full dark:bg-black-100 bg-white dark:bg-grid-white/[0.03] bg-grid-black/[0.2] flex items-center justify-center absolute top-0 left-0">
                {/* Radial gradient for the container to give a faded look */}
                <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
            </div>

            <div className='relative z-10 flex justify-center my-20'>
                <div className='max-w-89 md:max-w-2xl lg:max-w-[60vw] flex-col items-center justify-center'>
                    <h2 className='text-xs tracking-widest text-blue-100 uppercase text-center max-w-80'>
                        Dynamic Web Magic with Next.js
                    </h2>
                    <TextGenerateEffect
                        className='text-center text-5xl md:text-5xl lg:text-6xl'
                        words='Transforming Concepts into seamless Experiences'
                    />
                    <p className='mb-4 text-sm text-center md:tracking-wider md:text-lg lg:text-2xl'>
                        Hi, I'm Hussein Yussuf, a Full-stack developer.
                    </p>
                    <a href='#about'>
                        <MagicButton
                            title="Show My Work"
                            icon={<FaLocationArrow />}
                            position="right"
                        />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Hero;
