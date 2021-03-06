import firebase from 'firebase';
import { useHistory } from 'react-router';
import { auth, db } from '../firebase';

export const useLogin: () => (
  provider: firebase.auth.AuthProvider,
) => Promise<void> = () => {
  const history = useHistory();
  const login = async (provider: firebase.auth.AuthProvider): Promise<void> => {
    await firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        if (
          // 新規登録か判定
          result.user?.metadata.creationTime ===
          result.user?.metadata.lastSignInTime
        ) {
          db.collection('users')
            .doc(result.user?.uid)
            .onSnapshot((doc) => {
              if (doc.data()) {
                history.push('/profile/edit');
              }
            });
        } else {
          history.push('/notice');
        }
      });
  };

  return login;
};

export const useLogout = (): (() => void) => {
  const logout = () => {
    void auth.signOut();
  };

  return logout;
};

export const useDeleteUser = (): (() => void) => {
  const deleteUser = auth.currentUser;
  const deleteAuthUser = () => {
    void deleteUser?.delete();
  };

  return deleteAuthUser;
};
