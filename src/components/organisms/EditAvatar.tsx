import { memo, useState, VFC } from 'react';
import {
  FormControl,
  FormLabel,
  useToast,
  Input,
  Text,
  Box,
  Flex,
  Spacer,
  Avatar,
  AlertStatus,
} from '@chakra-ui/react';
import Resizer from 'react-image-file-resizer';
import { db, storage } from '../../firebase';
import FormButton from '../atom/FormButton';

type Props = {
  valueAvatar: string | undefined;
  userId: string;
};

const EditAvatar: VFC<Props> = memo(({ valueAvatar, userId }) => {
  const [avatar, setAvatar] = useState<string>('');
  const [filename, setFilename] = useState<string>();
  const toast = useToast();

  const resizeFile = (file: Blob) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        200,
        200,
        'JPEG',
        80,
        0,
        (uri) => {
          resolve(uri);
        },
        'base64',
      );
    });

  const onSubmitAvatar = async () => {
    let toastTitle = 'アイコンを更新しました';
    let toastStatus: AlertStatus = 'success';
    try {
      // deta_url形式でアップロード
      await storage.ref(`avatars/${userId}`).putString(avatar, 'data_url');
      // アップしたurlを受け取ってfirestoreに保存
      const url = (await storage
        .ref('avatars')
        .child(userId)
        .getDownloadURL()) as string;
      await db.collection('users').doc(userId).update({ avatar: url });
    } catch (error) {
      toastTitle = 'アップロードに失敗しました';
      toastStatus = 'error';
    } finally {
      // アップロードの結果をトーストで表示
      setAvatar('');
      setFilename('');
      toast({
        title: toastTitle,
        status: toastStatus,
        position: 'top',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const onChangeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // ファイル名表示用
    const fileImage = e.target.files?.[0].name;
    setFilename(fileImage);
    const blobImage = e.target.files?.[0] as Blob;
    // 空ファイルを変換しないように
    if (blobImage !== undefined) {
      // 画像のみを受け付ける
      if (/image.*/.exec(blobImage.type)) {
        const resizeImage = (await resizeFile(blobImage)) as string;
        setAvatar(resizeImage);
      } else {
        toast({
          title: '画像のみアップロードできます',
          status: 'warning',
          position: 'top',
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <>
      <Avatar src={avatar || valueAvatar} marginY="10px" marginX="5px" />

      <Text color="header" marginBottom="5px" marginX="5px">
        アイコン
      </Text>

      <form onSubmit={onSubmitAvatar}>
        <FormControl>
          <Flex marginX="5px" borderBottom="1px" borderColor="secondary">
            <FormLabel
              htmlFor="avatar"
              color="link"
              whiteSpace="nowrap"
              border="1px"
              borderColor="link"
              borderRadius="md"
              display="inline-block"
              padding="7px"
              height="40px"
              cursor="pointer"
            >
              ファイルを選択
              <Input
                display="none"
                type="file"
                id="avatar"
                name="avatar"
                placeholder="ヘッダー"
                onChange={onChangeAvatar}
                accept="image/*"
              />
            </FormLabel>
            <Box
              paddingTop="8px"
              style={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                width: '200px',
              }}
            >
              {filename || '選択されていません'}
            </Box>

            <Spacer />
            <Box display="inline-block">
              <FormButton
                onClick={onSubmitAvatar}
                display="inline-block"
                isDisabled={!filename}
              >
                更新する
              </FormButton>
            </Box>
          </Flex>
        </FormControl>
      </form>
    </>
  );
});

export default EditAvatar;
