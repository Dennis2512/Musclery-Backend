import { Exercise } from './exercise';

export class Training {
  private id?: string;
  private date?: Date;
  private exercises: Exercise[];
  constructor(id?: string, date?: Date, exercises?: Exercise[]) {
    this.id = id;
    this.date = date;
    this.exercises = exercises || [];
  }

  // setter

  public setID(id: string): void {
    this.id = id;
  }

  public setDate(date: Date): void {
    this.date = date;
  }

  public setExercises(exercises: Exercise[]): void {
    this.exercises = exercises;
  }

  public addExercise(exercise: Exercise): void {
    this.exercises.push(exercise);
  }

  public removeExercise(exercise: Exercise): void {
    this.exercises.splice(this.exercises.indexOf(exercise), 1);
  }

  // getter

  public getID(): string | undefined {
    return this.id;
  }

  public getDate(): Date | undefined {
    return this.date;
  }

  public getExercises(): Exercise[] {
    return this.exercises;
  }
}
