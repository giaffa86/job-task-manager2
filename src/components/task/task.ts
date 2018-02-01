export class ITask {
    $key: string;
    title: string;
    description: string;
    type: string;
    place: string;
    address: string;
    customer: string;
    activity: string;
    notes: string;
    status: number;
    createdBy: string;
    createdDate: Date;
    sentBy: string;
    sentTo: string[];
    sentDate: Date;
    takenChargeBy: any;
    reportNotes: string;
    completedDate: Date;
    lastModifiedDate: Date;
}

export class Task {


    constructor(public initData: ITask) {
    }

    public get data(): ITask { return this.initData; }
    
    public get id(): string { return this.initData.$key; }
    
    public get title(): string { return this.initData.title; }
    public set title(title: string) { this.initData.title = title; }
    
    public get description(): string { return this.initData.description; }
    public set description(description: string) { this.initData.description = description; }
    
    public get type(): string { return this.initData.type; }
    public set type(type: string) { this.initData.type = type; }
    
    public get place(): string { return this.initData.place; }
    public set place(place: string) { this.initData.place = place; }
    
    public get address(): string { return this.initData.address; }
    public set address(address: string) { this.initData.address = address; }
    
    public get fulladdress(): string { return this.initData.place + ', ' + this.initData.address; }
    
    public get customer(): string { return this.initData.customer; }
    public set customer(customer: string) { this.initData.customer = customer; }
    
    public get activity(): string { return this.initData.activity; }
    public set activity(activity: string) { this.initData.activity = activity; }
    
    public get notes(): string { return this.initData.notes; }
    public set notes(notes: string) { this.initData.notes = notes; }

    public get status(): number { return this.initData.status; }
    public set status(status: number) { this.initData.status = status; }

    public get createdBy(): string { return this.initData.createdBy; }
    public set createdBy(createdBy: string) { this.initData.createdBy = createdBy; }

    public get createdDate(): Date { return this.initData.createdDate; }
    public set createdDate(createdDate: Date) { this.initData.createdDate = createdDate; }

    public get sentBy(): string { return this.initData.sentBy; }
    public set sentBy(sentBy: string) { this.initData.sentBy = sentBy; }

    public get sentTo(): string[] { return this.initData.sentTo; }
    public set sentTo(sentTo: string[]) { this.initData.sentTo = sentTo; }

    public get sentDate(): Date { return this.initData.sentDate; }
    public set sentDate(sentDate: Date) { this.initData.sentDate = sentDate; }

    public get takenChargeBy(): any { return this.initData.takenChargeBy; }
    public set takenChargeBy(takenChargeBy: any) { this.initData.takenChargeBy = takenChargeBy; }

    public get reportNotes(): string { return this.initData.reportNotes; }
    public set reportNotes(reportNotes: string) { this.initData.reportNotes = reportNotes; }

    public get completedDate(): Date { return this.initData.completedDate; }
    public set completedDate(completedDate: Date) { this.initData.completedDate = completedDate; }

    public get lastModifiedDate(): Date { return this.initData.lastModifiedDate; }
    public set lastModifiedDate(lastModifiedDate: Date) { this.initData.lastModifiedDate = lastModifiedDate; }



}