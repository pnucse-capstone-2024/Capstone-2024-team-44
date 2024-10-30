import { useState } from "react";
import {
  CloudInstanceList,
  CloudInstance,
} from "@/types/new-item/new-item-type";
import { validateProjectName } from "@/utils/validation-utils";

interface UseProjectInfoInputReturn {
  projectName: string;
  description: string;
  cloudName: string;
  containerName: string;
  sshInfoId: number | null;
  cloudOptions: string[];
  containerOptions: string[];
  isValidProjectName: boolean;
  projectNameMsg: string;
  isProjectNameEdited: boolean;
  handleProjectNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDescriptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCloudSelect: (name: string) => void;
  handleContainerSelect: (name: string) => void;
}

export default function useProjectInfoInput(
  initialProjectName = "",
  initialDescription = "",
  initialCloudName = "",
  initialContainerName = "",
  initialCloudInstances: CloudInstanceList | null = null
): UseProjectInfoInputReturn {
  const [projectName, setProjectName] = useState<string>(initialProjectName);
  const [description, setDescription] = useState<string>(initialDescription);
  const [cloudName, setCloudName] = useState<string>(initialCloudName);
  const [containerName, setContainerName] =
    useState<string>(initialContainerName);
  const [isValidProjectName, setIsValidProjectName] = useState(false);
  const [projectNameMsg, setProjectNameMsg] = useState<string>("");
  const [isProjectNameEdited, setIsProjectNameEdited] = useState(false);
  const [sshInfoId, setSshInfoId] = useState<number | null>(null);
  const [cloudInstances, setCloudInstances] = useState<CloudInstance[]>(
    initialCloudInstances ? initialCloudInstances.cloudInstances : []
  );
  const [cloudOptions, setCloudOptions] = useState<string[]>(
    initialCloudInstances
      ? [
          ...initialCloudInstances.cloudInstances.map(
            (cloud) => cloud.cloudName
          ),
          "연결하지 않음",
        ]
      : ["연결하지 않음"]
  );
  const [containerOptions, setContainerOptions] = useState<string[]>([
    "연결하지 않음",
  ]);
  const maxDescriptionLength = 300;

  const handleCloudSelect = (name: string) => {
    setCloudName(name);

    const selectedCloud = cloudInstances.find(
      (cloud) => cloud.cloudName === name
    );

    if (selectedCloud) {
      setSshInfoId(selectedCloud.sshInfoId);
      const containerNames = selectedCloud.containers.map(
        (container) => container.containerName
      );
      setContainerOptions([...containerNames, "연결하지 않음"]);
    } else {
      setSshInfoId(null);
      setContainerOptions(["연결하지 않음"]);
    }
    setContainerName("");
  };

  const handleContainerSelect = (name: string) => {
    setContainerName(name);
  };

  const handleProjectNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputProjectName = event.target.value;
    setProjectName(inputProjectName);

    if (inputProjectName.trim() === "") {
      setIsValidProjectName(false);
      setProjectNameMsg("");
      return;
    }

    if (
      initialProjectName !== null &&
      initialProjectName === inputProjectName
    ) {
      setIsValidProjectName(true);
      setProjectNameMsg("현재 사용 중인 프로젝트 이름입니다.");
      return;
    }

    if (validateProjectName(inputProjectName)) {
      setIsValidProjectName(true);
      setProjectNameMsg("사용 가능한 프로젝트 이름입니다.");
    } else {
      setIsValidProjectName(false);
      setProjectNameMsg(
        "3-32자의 한글, 영어, 숫자, 하이픈(-), 밑줄(_)을 입력해주세요."
      );
    }
    setIsProjectNameEdited(true);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputDescription = event.target.value;
    if (inputDescription.length <= maxDescriptionLength) {
      setDescription(inputDescription);
    }
  };

  return {
    projectName,
    description,
    cloudName,
    containerName,
    sshInfoId,
    cloudOptions,
    containerOptions,
    isValidProjectName,
    projectNameMsg,
    isProjectNameEdited,
    handleProjectNameChange,
    handleDescriptionChange,
    handleCloudSelect,
    handleContainerSelect,
  };
}
