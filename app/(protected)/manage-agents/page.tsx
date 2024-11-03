'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Connection,
  Edge,
  Node,
  NodeTypes,
  Handle,
  Position,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AIAgent {
  id: string;
  name: string;
  model: 'gpt-3.5-turbo' | 'gpt-4';
  prompt: string;
}

interface AIConnection {
  id: string;
  label: string;
}

// Mock API functions
const fetchAgents = async (): Promise<AIAgent[]> => {
  return [
    { id: '1', name: 'General Support', model: 'gpt-3.5-turbo', prompt: 'You are a helpful customer service agent.' },
    { id: '2', name: 'Technical Support', model: 'gpt-4', prompt: 'You are a technical support specialist.' },
    { id: '3', name: 'Sales Agent', model: 'gpt-3.5-turbo', prompt: 'You are a knowledgeable sales representative.' },
  ]
}

const saveAgent = async (agent: AIAgent): Promise<AIAgent> => {
  console.log('Saving agent:', agent)
  return agent
}

const deleteAgent = async (id: string): Promise<void> => {
  console.log('Deleting agent:', id)
}

const AIAgentNode = ({ data }: { data: AIAgent }) => (
  <div className="bg-white border-2 border-gray-200 rounded-md p-3 shadow-md">
    <Handle type="target" position={Position.Top} className="w-4 h-4 bg-blue-500" />
    <h3 className="font-bold text-lg">{data.name}</h3>
    <p className="text-sm text-gray-500">Model: {data.model}</p>
    <Handle type="source" position={Position.Bottom} className="w-4 h-4 bg-blue-500" />
  </div>
)

const nodeTypes: NodeTypes = {
  aiAgent: AIAgentNode,
}

export default function AIWorkflowManager() {
  const [agents, setAgents] = useState<AIAgent[]>([])
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<Node<AIAgent> | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<Edge<AIConnection> | null>(null)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)

  useEffect(() => {
    fetchAgents().then(fetchedAgents => {
      setAgents(fetchedAgents)
      const initialNodes = fetchedAgents.map((agent, index) => ({
        id: agent.id,
        type: 'aiAgent',
        data: agent,
        position: { x: 250 * index, y: 50 },
      }))
      setNodes(initialNodes)
    })
  }, [])

  const onConnect = useCallback((params: Connection | Edge) => {
    const newEdge: Edge<AIConnection> = {
      ...params,
      id: `e${params.source}-${params.target}-${Date.now()}`,
      animated: true,
      label: 'New Connection',
      data: { id: '1', label: 'New Connection' },
      markerEnd: { type: MarkerType.ArrowClosed },
    } as Edge<AIConnection>

    setEdges((eds: any) => addEdge(newEdge, eds))
  }, [setEdges])

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      if (reactFlowWrapper.current && reactFlowInstance) {
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
        const agentId = event.dataTransfer.getData('application/reactflow')
        const agent = agents.find(a => a.id === agentId)

        if (agent) {
          const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
          })
          const newNode: Node<AIAgent> = {
            id: `${agent.id}-${Date.now()}`,
            type: 'aiAgent',
            position,
            data: { ...agent },
          }
          setNodes((nds: any) => nds.concat(newNode))
        }
      }
    },
    [reactFlowInstance, agents]
  )

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node<AIAgent>) => {
    setSelectedNode(node)
    setSelectedEdge(null)
  }, [])

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge<AIConnection>) => {
    setSelectedEdge(edge)
    setSelectedNode(null)
  }, [])

  const handleAgentUpdate = async (updatedAgent: AIAgent) => {
    const savedAgent = await saveAgent(updatedAgent)
    setNodes((nds: any[]) => nds.map((node: any) => node.id === selectedNode?.id ? { ...node, data: savedAgent } : node))
    setSelectedNode(null)
  }

  const handleAgentDelete = async (id: string) => {
    await deleteAgent(id)
    setNodes((nds: any[]) => nds.filter((node: { id: string }) => node.id !== id))
    setEdges((eds: any[]) => eds.filter((edge: { source: string; target: string }) => edge.source !== id && edge.target !== id))
    setSelectedNode(null)
  }

  const handleEdgeUpdate = (id: string, newLabel: string) => {
    setEdges((eds: any[]) => eds.map((edge: any) => 
      edge.id === id ? { ...edge, label: newLabel, data: { ...edge.data, label: newLabel } } : edge
    ))
    setSelectedEdge(null)
  }

  const handleEdgeDelete = (id: string) => {
    setEdges((eds: any[]) => eds.filter((edge: { id: string }) => edge.id !== id))
    setSelectedEdge(null)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Workflow Manager</h1>
      
      <div className="flex h-[600px]">
        <div className="w-1/4 pr-4 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Available Agents</h2>
          {agents.map(agent => (
            <div
              key={agent.id}
              draggable
              onDragStart={(event) => event.dataTransfer.setData('application/reactflow', agent.id)}
              className="mb-2 p-2 bg-gray-100 rounded cursor-move"
            >
              {agent.name}
            </div>
          ))}
        </div>
        
        <ReactFlowProvider>
          <div className="w-3/4 h-full" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              nodeTypes={nodeTypes}
              fitView
            >
              <Controls />
            </ReactFlow>
          </div>
        </ReactFlowProvider>
      </div>

      {selectedNode && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Edit Agent: {selectedNode.data.name}</CardTitle>
            <CardDescription>Configure your AI agent for the workflow</CardDescription>
          </CardHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const updatedAgent: AIAgent = {
              id: selectedNode.data.id,
              name: formData.get('name') as string,
              model: formData.get('model') as 'gpt-3.5-turbo' | 'gpt-4',
              prompt: formData.get('prompt') as string,
            }
            handleAgentUpdate(updatedAgent)
          }}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Agent Name</Label>
                <Input id="name" name="name" defaultValue={selectedNode.data.name} required />
              </div>
              <div>
                <Label htmlFor="model">AI Model</Label>
                <Select name="model" defaultValue={selectedNode.data.model}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="prompt">Initial Prompt</Label>
                <Textarea id="prompt" name="prompt" defaultValue={selectedNode.data.prompt} required />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="submit" className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button type="button" variant="destructive" onClick={() => handleAgentDelete(selectedNode.data.id)} className="flex items-center">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Agent
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {selectedEdge && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Edit Connection</CardTitle>
            <CardDescription>Manage the connection between agents</CardDescription>
          </CardHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const newLabel = formData.get('label') as string
            handleEdgeUpdate(selectedEdge.id, newLabel)
          }}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="label">Connection Label</Label>
                <Input id="label" name="label" defaultValue={selectedEdge.data?.label} required />
              </div>
              <p>Connection from {selectedEdge.source} to {selectedEdge.target}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="submit" className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button type="button" variant="destructive" onClick={() => handleEdgeDelete(selectedEdge.id)} className="flex items-center">
                <X className="w-4 h-4 mr-2" />
                Delete Connection
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  )
}