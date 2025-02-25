import { defineStore } from 'pinia';
import { Project, projects } from './projectTypes';

export const useProjectsStore = defineStore('projects', {
    state: () => ({
        projects: projects as Array<Project>,
    }),
    actions: {
        addProject(project: any) {
            this.projects.push(project);
        },
    },
    getters: {
        technologies(state) {
            return state.projects.reduce((acc, project) => {
                project.technologies.forEach(tech => {
                    if (!acc.includes(tech)) {
                        acc.push(tech);
                    }
                });
                return acc;
            }, [] as string[]);
        },
    },
}); 