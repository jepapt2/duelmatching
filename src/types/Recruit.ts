import firebase from 'firebase';
import PlayTitle from './playTitle';

type Recruit = {
  id?: string;
  organizerId: string;
  title: string;
  playTitle: PlayTitle | 'その他';
  format?: string;
  recruitNumber: number;
  place: string;
  point: string;
  start: firebase.firestore.Timestamp;
  end?: firebase.firestore.Timestamp;
  limit: firebase.firestore.Timestamp;
  overview?: string;
  friendOnly?: boolean;
  memberCount?: number;
  full?: boolean;
  cancel?: boolean;
  createdAt?: string;
};

export default Recruit;
