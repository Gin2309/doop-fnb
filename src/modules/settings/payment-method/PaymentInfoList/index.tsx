import { createBranchBankAccount, getBankList, getBranchBankAccounts } from "@/api/config-payment.service";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import { CustomModal } from "@/components/CustomModal";
import { CustomSelect } from "@/components/CustomSelect";
import CustomTable from "@/components/CustomTable";
import { branchStateSession } from "@/recoil/state";
import BankAccount from "@/shared/models/BankAccount";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Empty, Form } from "antd";
import { ColumnsType } from "antd/es/table";
import { AxiosError } from "axios";
import _ from "lodash";
import { useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { toast } from "sonner";

const PaymentInfoList = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [refetch, setRefetch] = useState(1);
  const branch = useRecoilValue(branchStateSession);
  const [currentAccount, setCurrentAccount] = useState<BankAccount | null>(null);

  const branchId = useMemo(() => {
    // return 263
    return +branch?.id;
  }, [branch?.id]);

  const [form] = Form.useForm<BankAccount>();

  const { data, isLoading } = useQuery(
    [
      "BANK_ACCOUNTS",
      page,
      pageSize,
      branchId,
      refetch
    ],
    () => getBranchBankAccounts({
      page,
      pageSize,
      branchId
    }),
    {
      enabled: !!branchId && !isNaN(branchId),
    }
  );

  const { mutateAsync: handleCreateBranchBankAccount } = useMutation(
    (data: BankAccount) => createBranchBankAccount(data),
    {
      onSuccess(data, variables, context) {
        toast.success("Đã lưu")
        setRefetch((prev) => prev + 1);
        toggleOpenDetailAccount(null);
      },
      onError(error) {
      }
    }
  );

  const { data: dataBanks, isLoading: bankLoading } = useQuery(
    ["BANK_LIST"],
    () => getBankList({})
  )

  const {
    bankOptions,
    mapBankData
  } = useMemo(() => {
    const bankOptions = (dataBanks?.data || [])
      .sort((a, b) => a.shortName.localeCompare(b.shortName))
      .map((bank) => {
        return {
          value: bank.bin,
          label: `${bank.shortName} - ${bank.name}`
        }
      });
    const mapBankData = _.keyBy((dataBanks?.data ?? []), "bin");

    return {
      bankOptions,
      mapBankData
    }
  }, [dataBanks]);

  const toggleOpenDetailAccount = (data: BankAccount | null) => {
    if (!!data) {
      form.setFieldsValue(data);
    } else {
      form.resetFields();
    }
    setCurrentAccount(data);
  }

  const dataSource = data?.data ?? [];

  const columns = useMemo(() => {
    const _columns: ColumnsType<BankAccount> = [
      {
        title: "Tên ngân hàng",
        dataIndex: "bankName"
      },
      {
        title: "Số tài khoản",
        dataIndex: "accountNo"
      },
      {
        title: "Tên tài khoản",
        dataIndex: "accountName"
      },
      {
        title: "Hành động",
        dataIndex: "action",
        render(value, record, index) {
          return <div className="flex items-center justify-center gap-2">
            <CustomButton type="original"
              onClick={() => {
                // TODO
              }}
            >
              Xoá
            </CustomButton>

            <CustomButton
              onClick={() => {
                toggleOpenDetailAccount(record);
              }}
            >
              Chỉnh sửa
            </CustomButton>
          </div>
        },
        align: "center"
      }
    ];
    return _columns;
  }, [dataSource])

  return <div className="pb-[20px]">
    <div className="flex justify-end mb-2">
      <CustomButton
        onClick={() => {
          toggleOpenDetailAccount(new BankAccount({
            bankId: bankOptions[0]?.value
          }));
        }}
      >
        Thêm thông tin thanh toán
      </CustomButton>
    </div>
    <CustomTable
      dataSource={dataSource}
      columns={columns}
      loading={isLoading}
      pagination={{
        current: page,
        pageSize
      }}
      locale={{
        emptyText: <Empty description="Chưa có thông tin thanh toán" />
      }}
    />

    <CustomModal
      title={currentAccount ? (!currentAccount._id ? 'Tạo thông tin thanh toán' : 'Chỉnh sửa thông tin thanh toán') : ''}
      destroyOnClose
      isOpen={!!currentAccount}
      onCancel={() => {
        toggleOpenDetailAccount(null);
      }}
      onSubmit={async () => {
        try {
          const values = await form.validateFields();
          const bank = mapBankData[values.bankId];
          const newData = new BankAccount({
            ...values,
            bankName: bank?.shortName,
            avatar: bank?.avatar,
            code: bank?.code,
            branchId,
            isActive: true
          });
          if (!newData._id) {
            await handleCreateBranchBankAccount(newData);
          } else {
            // TODO: Update
          }
        } catch (error) {
          let message = "Cập nhật không thành công";
          if (error instanceof AxiosError) {
            const _message = error.response?.data?.message;
            if (_message) message = _message;
          }
          toast.error(message);
        }
      }}
      children={<Form
        form={form}
        layout="vertical"
      >
        <Form.Item hidden name="_id" />
        <Form.Item
          name="bankId"
          label="Ngân hàng"
          required
          rules={[
            { required: true, message: "Vui lòng chọn ngân hàng" }
          ]}
        >
          <CustomSelect
            isLoading={bankLoading}
            options={bankOptions}
            showSearch
            placeholder="Chọn ngân hàng"
          />
        </Form.Item>

        <Form.Item
          name="accountNo"
          label="Số tài khoản"
          required
          rules={[
            { required: true, message: "Vui lòng nhập STK" }
          ]}
        >
          <CustomInput size="large" placeholder="Nhập STK" />
        </Form.Item>

        <Form.Item
          name="accountName"
          label="Tên tài khoản"
          required
          rules={[
            { required: true, message: "Vui lòng nhập tên tài khoản" }
          ]}
        >
          <CustomInput size="large" />
        </Form.Item>
      </Form>}
    />
  </div>
}

export default PaymentInfoList;