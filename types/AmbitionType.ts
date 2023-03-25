import {
  DocumentData,
  DocumentReference,
  FirestoreDataConverter,
  Timestamp,
} from "firebase/firestore";

export interface StateAmbition {
  id: string;
  content: String;
  message_of_support: String;
  support_count: Number;
  user_name: string;
  created_at?: Date;
  is_supported_ambition: boolean;
  avatar_image_path: string;
  author: DocumentReference<DocumentData>;
}

export class Ambition {
  constructor(
    readonly id: string,
    readonly content: string,
    readonly message_of_support: string,
    readonly support_count: number,
    readonly author: DocumentReference<DocumentData>,
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
      author: ambition.author,
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
      data.author,
      data.created_at
    );
  },
};

export class SupportedAmbition {
  constructor(
    readonly id: string,
    readonly ambition_id: string,
    readonly created_at?: Timestamp
  ) {}
}

export const supportedAmbitionConverter: FirestoreDataConverter<SupportedAmbition> =
  {
    toFirestore(supportedAmbition: SupportedAmbition) {
      return {
        id: supportedAmbition.id,
        ambition_id: supportedAmbition.ambition_id,
        created_at: supportedAmbition.created_at,
      };
    },
    fromFirestore(snapshot, options): SupportedAmbition {
      const data = snapshot.data(options);

      return new SupportedAmbition(
        snapshot.id,
        data.ambition_id,
        data.created_at
      );
    },
  };
