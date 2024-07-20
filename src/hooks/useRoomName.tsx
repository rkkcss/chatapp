import { User } from '../redux/userSlice';
import { useSelector } from 'react-redux';
import { UserStore } from '../store/store';

type useRoomNameProps = {
    participants?: User[]; // Engedélyezzük az undefined értéket is
}

const useRoomName = ({ participants = [] }: useRoomNameProps) => {
    const { user } = useSelector((state: UserStore) => state.userStore);

    if (!user) {
        return 'Unknown Room'; // Vagy bármilyen alapértelmezett érték
    }

    const otherParticipants = participants.filter(
        participant => participant.id !== user.id
    );

    if (otherParticipants.length === 0) {
        return 'No Other Participants'; // Vagy bármilyen alapértelmezett érték
    }

    let roomName = '';

    if (otherParticipants.length === 1) {
        const participant = otherParticipants[0];
        roomName = `${participant.firstName} ${participant.lastName}`;
    } else {
        roomName = otherParticipants.map(participant => participant.firstName).join(', ');
    }

    return roomName;
}

export default useRoomName;
