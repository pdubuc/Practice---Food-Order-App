export default function Button({ children, textOnly, className, ...props }) {
  let cssClasses = textOnly ? "text-button" : "button";
  // dynamic css: className so the syling can be adjusted / added from outside this component
  cssClasses += " " + className;

  return (
    //collecting all remaining props and spreading them onto the built-in button element
    <button className={cssClasses} {...props}>
      {children}
    </button>
  );
}
