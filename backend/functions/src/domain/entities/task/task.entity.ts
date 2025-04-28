export class Task {
    constructor(
        public id: string,
        public userId: string,
        public title: string,
        public description: string,
        public completed: boolean,
        public createdAt: Date,
    ) {}
}