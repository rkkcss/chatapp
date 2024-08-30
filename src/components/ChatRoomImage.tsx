import { useSelector } from 'react-redux';
import { UserStore } from '../store/store';
import { User } from '../redux/userSlice';
import { PublicUser } from '../types/globalTypes';

type ChatRoomImageProps = {
    participants: PublicUser[],
}

export const ChatRoomImage = ({ participants }: ChatRoomImageProps) => {
    const { user } = useSelector((state: UserStore) => state.userStore);

    if (!user) {
        return 'Unknown Room'; // Vagy bármilyen alapértelmezett érték
    }

    const otherParticipants = participants?.filter(
        participant => participant.id !== user.id
    ).slice(0, 2).sort((a: User, b: User) => {
        const firstNameA = a.firstName || ''; // Ha firstName undefined, akkor üres stringként kezeljük
        const firstNameB = b.firstName || '';
        return firstNameA.localeCompare(firstNameB);
    });

    return (
        <>
            {

                otherParticipants?.length === 1 ? (
                    <img src={otherParticipants[0].imageUrl} className="w-14 h-14 min-w-14 rounded-full object-cover" />
                ) :
                    (
                        <div className="relative w-14 h-14">
                            {otherParticipants?.map((participant, index) => {
                                return (
                                    index === 0 ?
                                        <img key={participant.id} src={participant.imageUrl} className="absolute bottom-0 rounded-full object-cover w-9 min-w-9 h-9 left-0 z-10" />
                                        :
                                        <img key={participant.id} src={participant.imageUrl} className="absolute top-0 rounded-full object-cover w-9 h-9 min-w-9 right-0" />
                                )
                            })}
                        </div>
                    )
            }
        </>
    )
}