import { FormEvent, useState } from "react";

import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

interface Hub {
  serialNo: string;
  status: "NEW" | "ACTIVE" | "SUSPENDED";
  statusDate: string;
}

const hubList: Hub[] = [
  {
    serialNo: uuidv4(),
    status: "NEW",
    statusDate: "1681146337664",
  },
  {
    serialNo: uuidv4(),
    status: "ACTIVE",
    statusDate: "1681145337664",
  },
  {
    serialNo: uuidv4(),
    status: "SUSPENDED",
    statusDate: "1681144337664",
  },
];

const Wrapper = styled.div`
  padding: 20px;
`;

const CardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`;

const Card = styled.div`
  border: 1px solid grey;
  padding: 15px;
  border-radius: 5px;
  flex: 0 0 300px;
  transition: all 0.2s;

  span {
    font-size: 14px;
    color: grey;
  }

  p:first-of-type {
    color: ${({ status }: Pick<Hub, "status">) =>
      status === "ACTIVE"
        ? "green"
        : status === "SUSPENDED"
        ? "red"
        : "orange"};
    font-weight: bold;
    letter-spacing: 1px;
  }

  &:hover {
    cursor: pointer;
    filter: brightness(70%);
  }
`;

const Button = styled.button`
  margin: 20px 0;
`;

const Edit = styled.div`
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 10px 0;
  max-width: 500px;
`;

const Form = styled.form`
  display: flex;
  gap: 10px;
  align-items: center;

  select {
    color: #222;
    text-transform: uppercase;
    padding: 12px;
    margin-left: 20px;
    background-color: white;
  }
`;

// helper
const dateFromTimestamp = (timestamp: string): string => {
  const date = new Date(+timestamp).toLocaleDateString("en-US");
  const time = new Date(+timestamp).toLocaleTimeString("en-US");

  return `${date} / ${time}`;
};

interface EditHubProps {
  currentHub: Hub | null;
  updateHub: (serialNo: string, updatedHub: Hub) => void;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

function EditHub({ currentHub, setEditing, updateHub }: EditHubProps) {
  const [hub, setHub] = useState<Hub | null>(currentHub);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    if (hub) {
      setHub({
        serialNo: hub.serialNo,
        status: value as "NEW" | "ACTIVE" | "SUSPENDED",
        statusDate: `${new Date().getTime()}`,
      });
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (hub) {
      updateHub(hub.serialNo, hub);
    }
    setEditing(false);
  };

  return (
    <Edit>
      <h4>Edit hub id: {hub?.serialNo}</h4>
      <Form onSubmit={handleSubmit}>
        <label>
          Change status:
          <select
            name="status"
            defaultValue={hub?.status}
            onChange={handleSelectChange}
          >
            <option value="NEW">New</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </label>

        <button type="submit">Save</button>
        <button type="button" onClick={() => setEditing(false)}>
          Cancel
        </button>
      </Form>
    </Edit>
  );
}

function App() {
  const [hubs, setHubs] = useState<Hub[]>(hubList);
  const [editing, setEditing] = useState<boolean>(false);
  const [currentHub, setCurrentHub] = useState<Hub | null>(null);

  const addHub = () => {
    setHubs([
      {
        serialNo: uuidv4(),
        status: "NEW",
        statusDate: `${new Date().getTime()}`,
      },
      ...hubs,
    ]);
  };

  const updateHub = (serialNo: string, updatedHub: Hub) => {
    setEditing(false);
    setHubs(hubs.map((hub) => (hub.serialNo === serialNo ? updatedHub : hub)));
  };

  const editHub = (hub: Hub) => {
    setEditing(true);
    setCurrentHub(hub);
  };

  return (
    <Wrapper>
      <Button type="button" onClick={addHub}>
        Add hub
      </Button>
      {editing && (
        <EditHub
          currentHub={currentHub}
          setEditing={setEditing}
          updateHub={updateHub}
        />
      )}

      <CardList>
        {hubs.map((hub) => {
          return (
            <Card key={hub.serialNo} status={hub.status}>
              <span>{hub.serialNo}</span>
              <p>{hub.status}</p>
              <p>{dateFromTimestamp(hub.statusDate)}</p>
              <button onClick={() => editHub(hub)}>Edit hub</button>
            </Card>
          );
        })}
      </CardList>
    </Wrapper>
  );
}

export default App;
