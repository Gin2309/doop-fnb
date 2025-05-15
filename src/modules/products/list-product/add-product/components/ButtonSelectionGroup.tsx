import { CustomButton } from "@/components/CustomButton";
import Image from "next/image";
import PlusIcons from "@/assets/plusOrangeIcon.svg";
import ModalWarn from "@/components/CustomModal/ModalWarn";
import { useState } from "react";
import { useRouter } from "next/router";
import CustomNotiAction from "@/modules/account-setup/ChangePhone/NotiDashboard";

const ButtonSelectionGroup = (props: {
    isNew?: boolean
}) => {
    const { isNew = true } = props;
    const router = useRouter();
    const [openWarn, setOpenWarn] = useState(false);
    return <>
        <CustomButton
            type="none"
            className="!w-fit text-[#F38B25]"
            prefixIcon={
                <Image src={PlusIcons} alt="Plus Icon" />
            }
            onClick={() => {
                if (isNew) {
                    setOpenWarn(true)
                    return;
                }
                router.push(`/products/selection-group/add`);
            }}
        >
            Thêm nhóm lựa chọn
        </CustomButton>
        <CustomNotiAction
            content=""
            isVisible={openWarn}
            setIsVisible={setOpenWarn}
            title="Mất thông tin dữ liệu khi tiếp túc chuyển trang"
            type="warn"
            textCancel="ở lại"
            textOk="đồng ý"
            onCancel={() => setOpenWarn(false)}
            onSubmit={() => router.push(`/products/selection-group/add`)}
        />
    </>
}

export default ButtonSelectionGroup;