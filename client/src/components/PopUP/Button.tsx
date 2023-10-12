type ButtonProps = {
  children: React.ReactNode;
};

function Message({ children }: ButtonProps) {
  return <h2>{children}</h2>;
}

export default Message;
