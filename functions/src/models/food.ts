export class food {
    private _id?: string;
    private name?: string;
    private carbsPMG?: number;
    private category?: string;
    private hint?: string;
    private nutriScore?: number;
    private proteinsPMG?: number;
    private barcode?: string;
    private calPMG?: number;
    private fatPMG?: number;


    constructor(
      id?: string,
      name?: string,
      carbsPMG?: number,
      category?: string,
      hint?: string,
      nutriScore?: number,
      proteinsPMG?: number,
      barcode?: string,
      calPMG?: number,
      fatPMG?: number,
    ) {
      this._id = id;
      this.name = name;
      this.calPMG = calPMG;
      this.carbsPMG = carbsPMG;
      this.category = category;
      this.hint = hint;
      this.nutriScore = nutriScore;
      this.proteinsPMG =  proteinsPMG;
      this.barcode = barcode;
      this.fatPMG = fatPMG;
    }
  
    // setter
    
    
    public setId(value: string) {
      this._id = value;
    }
    
    public setName(value: string) {
      this.name = value;
    }
    
    public setCalPMG(value: number) {
      this.calPMG = value;
    }
    
    public setCarbsPMG(value: number) {
      this.carbsPMG = value;
    }
    
    public setCategory(value: string) {
      this.category = value;
    }
    
    public setHint(value: string) {
      this.hint = value;
    }
    
    public setNutriScore(value: number) {
      this.nutriScore = value;
    }
    
    public setProteinsPMG(value: number) {
      this.proteinsPMG = value;
    }
    
    public setBarcode(value: string) {
      this.barcode = value;
    }
    
    public setfatPMG(value: number) {
      this.fatPMG = value;
    }
  
    
    
  
    // getter
    public getId(): string | undefined{
      return this._id;
    }

    public getName(): string | undefined{
      return this.name;
    }

    public getCalPMG(): number | undefined{
      return this.calPMG;
    }

    public getCarbsPMG(): number | undefined{
      return this.carbsPMG;
    }

    public getCategory(): string | undefined{
      return this.category;
    }

    public getHint(): string | undefined{
      return this.hint;
    }

    public getNutriScore(): number | undefined{
      return this.nutriScore;
    }

    public getProteinsPMG(): number | undefined{
      return this.proteinsPMG;
    }

    public getBarcode(): string | undefined{
      return this.barcode;
    }

    public getfatPMG(): number | undefined{
      return this.fatPMG;
    }

    
  }
  