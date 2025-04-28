import {User} from "../../../domain/entities/user/user.entity";
import {UserRepository} from "../../../domain/repository/user/user.repository";
import {db} from "../../firebase/firestore.config";
import {v4 as uuid} from "uuid";

/** Firestore implementation for User repository */
export class FirestoreUserRepository implements UserRepository {
  private collection = db.collection("users");

  /**
   * Find a user by email.
   * @param {string} email User email
   * @return {Promise<User | null>}
   */
  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await this.collection
      .where("email", "==", email)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    const data = doc.data();
    return new User(doc.id, data.email, data.createdAt.toDate());
  }

  /**
   * Create a new user.
   * @param {string} email User email
   * @return {Promise<User>}
   */
  async create(email: string): Promise<User> {
    const id = uuid();
    const createdAt = new Date();
    await this.collection.doc(id).set({email, createdAt});
    return new User(id, email, createdAt);
  }
}
