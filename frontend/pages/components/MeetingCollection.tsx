import {
    Stack,
    Heading,
    Button,
    FaPlusCircleIcon,
    TdCheckbox,
    ThCheckbox,
    Table,
    TableReel,
    Td,
    Th,
    Base,
    SearchInput,
    FaFilterIcon,
    FaCloudDownloadAltIcon,
    Dropdown,
    DropdownTrigger,
    DropdownContent,
    FaAngleDownIcon,
} from "smarthr-ui";
import Link from "next/link";
import React from 'react';
import { Meeting } from "@/types/Meeting";
import { useRouter } from "next/router";


type MeetingCollectionProps = {
    data: Meeting[];
    orgCrewId: string;
    title: string;
};

const MeetingCollection: React.FC<MeetingCollectionProps> = ({ data,
    title,
    orgCrewId,
}) => {
    const router = useRouter();
    const createMeeting = async () => {
        try {
            const response = await fetch('/api/meeting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, orgCrewId }),
            });

            if (!response.ok) {
                throw new Error('Meeting creation failed');
            }

            const data = await response.json();

            router.push(`/m/${data.id}`);
        } catch (error) {
            console.error('Error:', error);
            // エラーハンドリング
        }
    };

    return (
        <>
            <Stack>
                <div className="flex justify-between items-center">
                    <Heading>会議</Heading>
                    <Button
                        square
                        size="default"
                        prefix={<FaPlusCircleIcon alt="プラスアイコン" />}
                        onClick={createMeeting}
                    >
                        新規作成
                    </Button>
                </div>
                <Base className="overflow-x-auto">
                    {data.length !== 0 &&
                        <div className="p-4">
                            <SearchInput
                                name="default"
                                tooltipMessage="氏名、ヨミガナ、社員番号で検索できます。スペース区切りでAND検索ができます。"
                            ></SearchInput>
                            <Button className="ml-2">検索</Button>
                            <Button suffix={<FaFilterIcon />} className="ml-4">
                                絞り込み
                            </Button>
                            <Button prefix={<FaCloudDownloadAltIcon />} className="ml-4">
                                ダウンロード
                            </Button>
                        </div>}
                    <TableReel className="overflow-auto">
                        <Table>
                            <thead>
                                <tr>
                                    <ThCheckbox name="tableAllCheckbox" />

                                    <Th className="whitespace-nowrap">タイトル</Th>
                                    <Th className="whitespace-nowrap">公開日</Th>
                                    <Th className="whitespace-nowrap">最終更新日</Th>
                                    <Th className="whitespace-nowrap">所属部署</Th>
                                    <Th className="whitespace-nowrap">主催者</Th>
                                    <Th fixed>操作</Th>
                                </tr>
                            </thead>
                            {data.length !== 0 ? <tbody>
                                {data.map(
                                    (
                                        {
                                            id,
                                            title,
                                            created_at,
                                            updated_at,
                                            organizer,
                                            department,
                                        },
                                        i
                                    ) => (
                                        <tr key={id}>
                                            <TdCheckbox
                                                name={`tableCheckBox-${i}`}
                                                aria-labelledby={`name-${i}`}
                                            />

                                            <Td id={`name-${i}`}>
                                                <Link href={`/m/${id}`} className="linkText underline">
                                                    {title}
                                                </Link>
                                            </Td>
                                            <Td>{created_at}</Td>
                                            <Td>{updated_at}</Td>
                                            <Td>
                                                <Link
                                                    href="/"
                                                    className="linkText underline whitespace-nowrap"
                                                >
                                                    {department}
                                                </Link>
                                            </Td>
                                            <Td>
                                                <Link href="/" className="linkText underline">
                                                    {organizer}
                                                </Link>
                                            </Td>
                                            <Td fixed>
                                                <Dropdown>
                                                    <DropdownTrigger>
                                                        <Button suffix={<FaAngleDownIcon />}>操作</Button>
                                                    </DropdownTrigger>
                                                    <DropdownContent>
                                                        <ul className="list-none m-0 py-2 pl-0">
                                                            <li>
                                                                <Button variant="text">編集</Button>
                                                            </li>
                                                            <li>
                                                                <Button variant="text">削除</Button>
                                                            </li>
                                                        </ul>
                                                    </DropdownContent>
                                                </Dropdown>
                                            </Td>
                                        </tr>
                                    )
                                )}
                            </tbody> : <></>}
                        </Table>
                        {data.length === 0 && <Base padding={1.5} className="flex justify-center items-center flex-col"><p className="mt-16 mb-4">会議はまだ開催されていません。</p>
                            <Button
                                className="mb-16"
                                square
                                size="default"
                                prefix={<FaPlusCircleIcon alt="プラスアイコン" />}
                                onClick={createMeeting}
                            >
                                新規作成
                            </Button>
                        </Base>}
                    </TableReel>
                </Base >
            </Stack >
        </>
    );
};
export default MeetingCollection;