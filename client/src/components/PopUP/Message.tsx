type MessageProps = {
  children: React.ReactNode;
};

function Message({ children }: MessageProps) {
  return <h2>{children}</h2>;
}

export default Message;
