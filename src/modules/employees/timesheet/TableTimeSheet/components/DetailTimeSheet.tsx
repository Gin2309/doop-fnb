import { CustomModal } from "@/components/CustomModal";

const DetailTimeSheet = ({
  isOpen,
  onCancel,
}: {
  isOpen: boolean;
  onCancel: () => void;
}) => {
  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="CHU THI DUNG, NGAY 02/08/2024"
      width={650}
      customFooter={true}
    >
      ....
    </CustomModal>
  );
};

export default DetailTimeSheet;
