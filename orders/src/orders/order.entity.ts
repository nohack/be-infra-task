import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Orders {
  @PrimaryGeneratedColumn("uuid")
  orderID: string;

  @Column({ default: false })
  isCancelled: boolean;
}
