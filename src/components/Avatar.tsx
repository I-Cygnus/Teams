import type { MemberId, TeamMember } from '../data';
import Memoji from './Memoji';

interface AvatarProps {
  member: Pick<TeamMember, 'id' | 'name' | 'image'>;
  hover?: boolean;
  size?: number;
  className?: string;
  rounded?: 'full' | '3xl' | '2xl';
}

export default function Avatar({ member, hover, size = 200, className = '', rounded = 'full' }: AvatarProps) {
  const radius = rounded === 'full' ? 'rounded-full' : rounded === '3xl' ? 'rounded-3xl' : 'rounded-2xl';

  if (member.image) {
    return (
      <div
        className={`relative overflow-hidden ${radius} ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={member.image}
          alt={member.name}
          loading="lazy"
          className="w-full h-full object-cover"
          style={{
            transform: hover ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      </div>
    );
  }

  return <Memoji id={member.id as MemberId} hover={hover} size={size} />;
}
