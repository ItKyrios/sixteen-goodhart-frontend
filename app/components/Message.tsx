type MessageProps = {
  message: string;
};

const Message = ({ message }: MessageProps) => {
  return <div className='bg-green-600 rounded-xs p-3 mb-4'>{message}</div>;
};

export default Message;
