import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('installs')
@Index(['app_name', 'install_time', 'idfv'], { unique: true })
export class Installs {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 255 })
  public idfv: string;

  @Column({ type: 'varchar', length: 100 })
  public app_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public city: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public device_model: string;

  @Column({ type: 'time' })
  public install_time: string;

  @Column({ type: 'date' })
  public date: Date;

  @Column({ type: 'boolean', default: false })
  public is_lat: boolean;
}
