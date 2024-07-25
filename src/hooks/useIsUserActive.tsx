import { User } from '../redux/userSlice'
import { useSelector } from 'react-redux'
import { UserStore, WebSocketStore } from '../store/store'

type UseIsUserActiveProps = {
    participants?: User[]
}

export const useIsUserActive = ({ participants = [] }: UseIsUserActiveProps) => {
    const { user } = useSelector((state: UserStore) => state.userStore);
    const { activeUsers } = useSelector((state: WebSocketStore) => state.webSocketStore);

    // Szűrd ki a saját felhasználót a participants listából
    const otherParticipants = participants.filter(participant => participant.id !== user?.id);

    // Ha több mint 2 résztvevő van, akkor ne adjon vissza semmit
    if (otherParticipants.length > 1) {
        return false;
    }

    // Ellenőrizd, hogy a szűrt résztvevők közül van-e aktív felhasználó
    const isActiveUser = otherParticipants.some(participant =>
        activeUsers.some(activeUser => activeUser.id === participant.id)
    );

    return isActiveUser;
}