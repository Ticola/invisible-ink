const ImageAltList = ({ altTexts }) => (
  <ol className="list-decimal list-inside">
    {altTexts.map((alt, index) => (
      <li key={index} className="py-1">
        {alt || "[No Alt Text]"}
      </li>
    ))}
  </ol>
);

export default ImageAltList;
