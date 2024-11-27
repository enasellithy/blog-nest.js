import { Entity, ObjectIdColumn, Column, BeforeUpdate, BeforeInsert } from "typeorm";
import { ObjectId } from "mongodb";

@Entity()
export abstract class BasesEntity {
  @ObjectIdColumn()
  _id: ObjectId;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  setUpdatedAt() {
    // Update `updatedAt` only when the entity is modified
    if (this.updatedAt === null || this.updatedAt === undefined) {
      this.updatedAt = new Date(); // Set to current time if it's not already set
    }
  }

  markAsDeleted() {
    this.deletedAt = new Date();
  }
}