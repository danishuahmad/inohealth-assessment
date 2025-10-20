import { motion } from "framer-motion";

type AnimationWrapperProps = {
  children: React.ReactNode;
};
const AnimationWrapper = ({
  children,
}: AnimationWrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "linear" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimationWrapper;
