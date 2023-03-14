import { FirestoreDataConverter, Timestamp } from "firebase/firestore";

export interface StateAmbition {
  id: string;
  content: String;
  message_of_support: String;
  support_count: Number;
  user_name: string;
  created_at?: Date;
  is_supported_ambition: boolean;
}

export class Ambition {
  constructor(
    readonly id: string,
    readonly content: string,
    readonly message_of_support: string,
    readonly support_count: number,
    readonly auth: {
      path: string;
      id: string;
    },
    readonly created_at?: Timestamp
  ) {}
}

export const ambitionConverter: FirestoreDataConverter<Ambition> = {
  toFirestore(ambition: Ambition) {
    return {
      id: ambition.id,
      content: ambition.content,
      message_of_support: ambition.message_of_support,
      support_count: ambition.support_count,
      auth: ambition.auth,
      created_at: ambition.created_at,
    };
  },
  fromFirestore(snapshot, options): Ambition {
    const data = snapshot.data(options);

    return new Ambition(
      snapshot.id,
      data.content,
      data.message_of_support,
      data.support_count,
      data.auth,
      data.created_at
    );
  },
};
