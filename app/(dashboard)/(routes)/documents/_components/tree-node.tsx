"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TreeNodeProps {
  name: string;
  children?: TreeNodeProps[];
}

const TreeNode: React.FC<TreeNodeProps> = ({ name, children }) => {
  const pathname = usePathname();
  return (
    <div>
      <Link href={`${pathname}/${name}`}>{name}</Link>
      {children && (
        <div style={{ marginLeft: "20px" }}>
          {children.map((child, index) => (
            <TreeNode key={index} {...child} />
          ))}
        </div>
      )}
    </div>
  );
};
