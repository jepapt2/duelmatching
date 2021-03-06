import {
  Avatar,
  Box,
  Flex,
  Spacer,
  Text,
  Divider,
  Icon,
} from '@chakra-ui/react';
import { memo, VFC } from 'react';
import { useHistory } from 'react-router';
import { GiPlainCircle } from 'react-icons/gi';

type Props = {
  text?: string;
  recId: string;
  recName: string;
  recAvatar: string;
  read: boolean;
  updateAt: string;
  roomId?: string;
};

const NewMessageNotice: VFC<Props> = memo((props) => {
  const { text, recId, recName, recAvatar, read, updateAt, roomId } = props;
  const history = useHistory();

  return (
    <>
      <Box
        padding="5px"
        cursor="pointer"
        onClick={() => history.push(`/chat/${roomId as string}`)}
      >
        <Flex marginBottom="1">
          <Avatar
            src={recAvatar}
            onClick={(e) => {
              e.stopPropagation();
              history.push(`/user/${recId}`);
            }}
            display="inline-block"
            zIndex="1"
          />
          <Box marginLeft="1">
            <Text fontWeight="semibold">{recName}</Text>
            <Text color="gray.600">
              {text && text.length > 45 ? `${text.substr(0, 45)}...` : text}
            </Text>
          </Box>

          {!read && (
            <>
              <Spacer />
              <Icon as={GiPlainCircle} color="link" />
            </>
          )}
        </Flex>

        <Text fontSize="sm">{updateAt}</Text>
      </Box>
      <Divider borderColor="secondary" />
    </>
  );
});
export default NewMessageNotice;
