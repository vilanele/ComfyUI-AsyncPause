import asyncio
import threading
from uuid import uuid4

from aiohttp import web

import nodes
from comfy.model_management import (
    InterruptProcessingException,
    throw_exception_if_processing_interrupted,
)
from comfy_api.latest import io
from server import PromptServer

pause_events: dict[str, threading.Event] = {}


class Pause(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="Pause",
            category="utils",
            display_name="Pause",
            inputs=[
                io.AnyType.Input("any", display_name="any"),
                io.Boolean.Input(
                    "force_pause",
                    default=False,
                    tooltip="Force execution of the node",
                ),
            ],
            outputs=[io.AnyType.Output("output", display_name="any")],
            hidden=[io.Hidden.unique_id],
        )

    @classmethod
    async def execute(cls, any, force_pause=False):
        unique_id = cls.hidden.unique_id
        event = threading.Event()
        pause_events[unique_id] = event
        PromptServer.instance.send_sync(
            "entering_pause_loop", {"executionId": unique_id}
        )
        try:
            while not event.is_set():
                throw_exception_if_processing_interrupted()
                await asyncio.sleep(0.01)
        except InterruptProcessingException as e:
            nodes.interrupt_processing()
            raise e
        finally:
            del pause_events[unique_id]

        return io.NodeOutput(any)

    @classmethod
    def fingerprint_inputs(cls, any, force_pause=False):
        return str(uuid4()) if force_pause else hash(any)


@PromptServer.instance.routes.post("/async_pause/continue")
async def continue_execution(request: web.Request):
    json_data = await request.json()
    executionId = json_data.get("executionId")
    if executionId in pause_events:
        pause_events[executionId].set()
    return web.Response(status=200)


class NotifyAudioOutput(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="NotifyAudioOutput",
            category="utils",
            display_name="Notify Audio",
            is_output_node=True,
            inputs=[
                io.AnyType.Input("any", display_name="any"),
            ],
        )

    @classmethod
    def execute(cls, any) -> io.NodeOutput:
        return io.NodeOutput(ui={"frontend_on_executed_dummy_trigger": []})


class NotifyAudioPassthrough(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="NotifyAudioPassthrough",
            category="utils",
            display_name="Notify Audio (Passthrough)",
            inputs=[
                io.AnyType.Input("any", display_name="any"),
            ],
            outputs=[
                io.AnyType.Output("output", display_name="any"),
            ],
        )

    @classmethod
    def execute(cls, any) -> io.NodeOutput:
        return io.NodeOutput(any, ui={"frontend_on_executed_dummy_trigger": []})


class NotifyToastOutput(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="NotifyToastOutput",
            display_name="Toast",
            category="utils",
            is_output_node=True,
            inputs=[
                io.AnyType.Input("any"),
                io.String.Input(
                    "detail",
                    multiline=True,
                    tooltip="Detail message to display in toast",
                    placeholder="Toast message",
                ),
                io.Combo.Input(
                    "severity",
                    options=[
                        "success",
                        "info",
                        "warn",
                        "error",
                        "secondary",
                        "contrast",
                    ],
                    default="info",
                    tooltip="Message severity level",
                ),
                io.Int.Input(
                    "life",
                    min=0,
                    default=3000,
                    max=1000000000,
                    display_name="life (ms)",
                    tooltip="Duration in milliseconds before auto-closing",
                    step=500,
                ),
            ],
        )

    @classmethod
    def execute(cls, **kwargs) -> io.NodeOutput:
        return io.NodeOutput(ui={"frontend_on_executed_dummy_trigger": []})


class NotifyToastPassthrough(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="NotifyToastPassthrough",
            display_name="Toast (Passthrough)",
            category="utils",
            inputs=[
                io.AnyType.Input("any"),
                io.String.Input(
                    "detail",
                    multiline=True,
                    tooltip="Detail message to display in toast",
                    placeholder="Toast message",
                ),
                io.Combo.Input(
                    "severity",
                    options=[
                        "success",
                        "info",
                        "warn",
                        "error",
                        "secondary",
                        "contrast",
                    ],
                    default="info",
                    tooltip="Message severity level",
                ),
                io.Int.Input(
                    "life",
                    min=0,
                    default=3000,
                    max=100000000,
                    display_name="life (ms)",
                    tooltip="Duration in milliseconds before auto-closing",
                    step=500,
                ),
            ],
            outputs=[io.AnyType.Output("output", display_name="any")],
        )

    @classmethod
    def execute(cls, **kwargs) -> io.NodeOutput:
        return io.NodeOutput(
            kwargs["any"], ui={"frontend_on_executed_dummy_trigger": []}
        )
