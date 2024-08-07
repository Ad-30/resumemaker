'use client'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import './List.css';
import { useContext, useEffect } from "react";
import { ConvertedApplicantData, convertToApplicantData } from "@/utils/dataConversion";
import { useSession } from "next-auth/react";
import ResumeContext from "@/context/ResumeContext";
import { useToast } from "@/components/ui/use-toast"
export default function LeftPanel() {
    const { toast } = useToast()
    const { setResumeURL, setIsResumeLoading, profileData, selectedTemplate, educationData, workData, skillsData, projectData, awardsData } = useContext(ResumeContext);

    const { data: session } = useSession();

    const resumeDetails = {
        creator: session?.user.id,
        selectedTemplate: selectedTemplate,
        headings: {
            education: educationData.sectionHeading,
            work: workData.sectionHeading,
            skills: skillsData.sectionHeading,
            projects: projectData.sectionHeading,
            awards: awardsData.sectionHeading
        },
        basics: profileData.profile,
        education: educationData.educationItems,
        work: workData.workItems,
        skills: skillsData.skillsItems,
        projects: projectData.projectItems,
        awards: awardsData.awardsItems
    }

    // useEffect(() => {
    //     console.log(profileData);
    //     console.log(educationData);
    //     console.log(workData);
    //     console.log(skillsData);
    //     console.log(projectData);
    //     console.log(awardsData);
    //     console.log(selectedTemplate);
    // }, [profileData, educationData, workData, skillsData, projectData, awardsData, selectedTemplate]);

    const defaultImageURL = "https://resushape.s3.eu-north-1.amazonaws.com/user.png"

    const handleSubmit = async (applicantData: ConvertedApplicantData, imageURL: string) => {

        setIsResumeLoading(true);

        try {
            const formData = new FormData();
            formData.append('applicantData', JSON.stringify(applicantData));
            formData.append('imageURL', imageURL);

            const response = await fetch('https://latexapi.pythonanywhere.com/latexResume', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Access-Key': process.env.NEXT_PUBLIC_X_ACCESS_KEY || ''
                },
            });



            if (!response.ok) {
                const data = await response.json();
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    // description: data.error || "Try adding sufficient data in fields",
                    description: "Please fill in all details correctly and ensure there are no blanks in any section to generate your resume efficiently."
                })
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setResumeURL(url);

        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsResumeLoading(false);
        }
    };

    const handleOnClick = async () => {

        try {
            const response = await axios.post('/api/resume', {
                selectedTemplate: selectedTemplate,
                basics: profileData,
                education: educationData,
                work: workData,
                skills: skillsData,
                projects: projectData,
                awards: awardsData
            })
        } catch (error) {
            console.error(error);
        } finally {
            await handleSubmit(convertToApplicantData(resumeDetails), profileData.profile.profilePicture || defaultImageURL)
        }
    }


    const pathname = usePathname();
    return (
        <div className="hidden md:block w-1/6 bg-black p-4 space-y-4 border border-gray-800">
            <nav className="bg-black text-white space-y-4 ">

                <div className={`hover-line flex justify-center font-bold ${pathname === '/resumeTemplates' ? 'text-emerald-400' : ''}`}>
                    <Link href="/resumeTemplates" className="w-full py-2">
                        Templates
                    </Link>
                </div>

                <div className={`hover-line flex justify-center hover:decoration-emerald-300 cursor-move ${pathname === '/profile' ? 'text-emerald-400' : ''}`}>
                    <Link href="/profile" className="w-full py-2">
                        Profile
                    </Link>
                </div>
                <div className={`hover-line flex justify-center hover:decoration-emerald-300 cursor-move ${pathname === '/education' ? 'text-emerald-400' : ''}`}>
                    <Link href="/education" className="w-full py-2">
                        Education
                    </Link>
                </div>

                <div className={`hover-line flex justify-center hover:decoration-emerald-300 cursor-move ${pathname === '/work' ? 'text-emerald-400' : ''}`}>
                    <Link href="/work" className="w-full py-2">
                        Work
                    </Link>
                </div>

                <div className={`hover-line flex justify-center hover:decoration-emerald-300 cursor-move ${pathname === '/skills' ? 'text-emerald-400' : ''}`}>
                    <Link href="/skills" className="w-full py-2">
                        Skills
                    </Link>
                </div>

                <div className={`hover-line flex justify-center hover:decoration-emerald-300 cursor-move ${pathname === '/projects' ? 'text-emerald-400' : ''}`}>
                    <Link href="/projects" className="w-full py-2">
                        Projects
                    </Link>
                </div>

                <div className={`hover-line flex justify-center hover:decoration-emerald-300 cursor-move ${pathname === '/awards' ? 'text-emerald-400' : ''}`}>
                    <Link href="/awards" className="w-full py-2">
                        Awards
                    </Link>
                </div>

                <div className="flex justify-center">
                    <Button
                        className="mt-4 mb-4 bg-emerald-400 text-black rounded-full w-1/2 py-3 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-opacity-50 active:bg-emerald-700 shadow-md transition duration-150 ease-in-out"
                        size={'sm'}
                        onClick={handleOnClick}
                    >
                        MAKE
                    </Button>
                </div>
            </nav>

        </div>
    )
}