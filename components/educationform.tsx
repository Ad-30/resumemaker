'use client'
import React, { useEffect } from 'react';
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EducationSchema } from '@/schemas';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EducationFormProps } from '@/app/interfaces';

const EducationForm: React.FC<EducationFormProps> = (props) => {
    const form = useForm<z.infer<typeof EducationSchema>>({
        resolver: zodResolver(EducationSchema),
        defaultValues: props.initialValues || {
            school: '',
            schoolLocation: '',
            degree: '',
            major: '',
            gpa: '',
            startDate: '',
            endDate: ''
        }
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const subscription = form.watch((values) => {
                props.updateEducationItem(props.educationCount - 1, values); // Call updateEducationItem with educationCount as ID and values as the new item
            });
            return () => subscription.unsubscribe();
        }

    }, [form, props]);

    const onSubmit = async (values: z.infer<typeof EducationSchema>) => {
        console.log(values);
    }


    return (

        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4 mt-12'
            >
                <hr className=" my-2 border-4 border-emerald-400" />
                <div className="flex justify-center">
                    <Button className="border rounded-full bg-transparent text-emerald-400 border-gray-700 hover:border-emerald-400 hover:text-emerald-400">{props.educationCount}</Button>
                </div>
                <FormField
                    control={form.control}
                    name="school"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="school">School Name</FormLabel>
                            <FormControl>
                                <Input
                                    id='school'
                                    placeholder="Standford University"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="schoolLocation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="schoolLocation">School Location</FormLabel>
                            <FormControl>
                                <Input
                                    id='schoolLocation'
                                    placeholder="Standford, CA"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="degree"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="degree">Degree</FormLabel>
                            <FormControl>
                                <Input
                                    id='degree'
                                    placeholder="B-tech"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="major"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="major">Major</FormLabel>
                            <FormControl>
                                <Input
                                    id='major'
                                    placeholder="Computer Science"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="gpa"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="gpa">GPA</FormLabel>
                            <FormControl>
                                <Input
                                    id='gpa'
                                    placeholder="9.6"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="startDate">Start Date</FormLabel>
                            <FormControl>
                                <Input
                                    id='startDate'
                                    placeholder="Sep 2015"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="endDate">End Date</FormLabel>
                            <FormControl>
                                <Input
                                    id='endDate'
                                    placeholder="June 2019"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* <Button type='submit'>Click</Button> */}
            </form>
        </Form>
    )
}

export default EducationForm;
