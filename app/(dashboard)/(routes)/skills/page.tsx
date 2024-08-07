'use client'
import React, { useState, useEffect, useContext } from 'react';
import SkillsForm from '@/components/skillsform';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SkillsItem } from '@/app/interfaces';
import Cookies from 'js-cookie';
import { useSession } from 'next-auth/react';
import ResumeContext from '@/context/ResumeContext';



const Page = () => {

    const { data: session } = useSession();
    const { skillsData, setSkillsData } = useContext(ResumeContext);

    const cookiesSkillsData = Cookies.get('skillsData');
    const parsedSkillsData = cookiesSkillsData ? JSON.parse(cookiesSkillsData) : null;

    const savedSkillsData = session?.user?.resumeDetails?.skills;
    const defaultSkillsData = { sectionHeading: '', skillsItems: [] };

    const initialSkillsData: { sectionHeading: string, skillsItems: SkillsItem[] } = parsedSkillsData?.skillsItems && (parsedSkillsData.skillsItems.length > 0 || parsedSkillsData.sectionHeading !== "")
        ? parsedSkillsData
        : savedSkillsData && (savedSkillsData.length > 0 || session?.user.resumeDetails.headings.skills !== "")
            ? { sectionHeading: session?.user.resumeDetails.headings.skills, skillsItems: savedSkillsData }
            : defaultSkillsData;

    // const [skillsData, setSkillsData] = useState<{ sectionHeading: string, skillsItems: SkillsItem[] }>(initialSkillsData);

    const updateSkillsItem = (id: number, newItem: SkillsItem) => {
        setSkillsData(prevState => ({
            ...prevState,
            skillsItems: [
                ...(prevState.skillsItems || []).slice(0, id),
                newItem,
                ...(prevState.skillsItems || []).slice(id + 1)
            ]
        }));
    };

    const [skillsForms, setSkillsForms] = useState<React.ReactNode[]>(initialSkillsData?.skillsItems?.map((item: SkillsItem, index: number) => (
        <SkillsForm key={index} skillsCount={index + 1} updateSkillsItem={updateSkillsItem} initialValues={item} />
    )));
    if (skillsForms.length === 0) {
        setSkillsForms([<SkillsForm key={0} skillsCount={1} updateSkillsItem={updateSkillsItem} />]);
    }
    useEffect(() => {
        if (typeof window !== 'undefined') {
            Cookies.set('skillsData', JSON.stringify(skillsData));
        }

    }, [skillsData]);

    Cookies.set('skillsData', JSON.stringify(skillsData));

    const [sectionHeading, setSectionHeading] = useState(initialSkillsData.sectionHeading);
    const addSkill = () => {
        const newId = skillsForms.length;
        const newSkillsItem: SkillsItem = {
            skillName: '',
            skillDetail: []
        };

        setSkillsForms(prevForms => [
            ...prevForms,
            <SkillsForm
                key={newId}
                skillsCount={newId + 1}
                updateSkillsItem={updateSkillsItem}
                initialValues={newSkillsItem}
            />
        ]);
        setSkillsData(prevData => ({
            ...prevData,
            skillsItems: [...prevData.skillsItems, newSkillsItem]
        }));
    };


    const removeSkill = () => {
        if (skillsForms.length > 1) {
            setSkillsForms(skillsForms.slice(0, -1));
            setSkillsData(prevData => ({ ...prevData, skillsItems: prevData.skillsItems.slice(0, -1) }));

        }
    };
    const handleSectionHeadingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSectionHeading = e.target.value;
        setSectionHeading(newSectionHeading);
        setSkillsData(prevData => ({ ...prevData, sectionHeading: newSectionHeading }));
    };

    return (
        <main className="bg-black text-white w-full p-4 overflow-auto md:w-1/3 border border-gray-800">
            <h2 className="text-xl font-bold text-white">Skills</h2>
            <div className='mt-4 mb-8' >
                <Label htmlFor="section-heading">Section Heading</Label>
                <Input id="section-heading" placeholder="Skills" value={sectionHeading} onChange={handleSectionHeadingChange} />
            </div>

            {skillsForms}

            <div className="flex space-x-2 mt-8">
                <Button className="bg-black text-emerald-400 border border-emerald-400" onClick={addSkill}>
                    Add Skill
                </Button>
                <Button className="bg-black text-gray-700 border border-gray-700" onClick={removeSkill}>
                    Remove Skill
                </Button>
            </div>
        </main>
    );
};


export default Page;