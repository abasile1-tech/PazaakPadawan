interface BarComponentProps {
  chosenCharacter: string;
}

const BarComponent = ({ chosenCharacter }: BarComponentProps) => {
  return (
    <div className="bar-component">
      <p id="chosen-character">{`${chosenCharacter}'s Turn`}</p>
    </div>
  );
};

export default BarComponent;
