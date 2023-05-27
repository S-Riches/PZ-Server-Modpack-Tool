// define a workshop item as its just a mod
class workshopItem {
    // takes in 4 values
    constructor(title, modId, workshopId, imageCDN) {
        this.title = title;
        this.modId = modId;
        this.workshopId = workshopId;
        this.imageCDN = imageCDN;
    }
}

// this class is created when mod ids > 1, this class contains methods relevant to mulitple mod ids
class conflictingWorkshopItem extends workshopItem {
    constructor(title, conflicts, workshopId, imageCDN) {
        super(title, conflicts, workshopId, imageCDN);
    }
}
