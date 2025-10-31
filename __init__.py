from comfy_api.latest import ComfyExtension, io

from .nodes import (
    NotifyAudioOutput,
    NotifyAudioPassthrough,
    NotifyToastOutput,
    NotifyToastPassthrough,
    Pause,
)


class MyExtension(ComfyExtension):
    async def get_node_list(self) -> list[type[io.ComfyNode]]:
        return [
            Pause,
            NotifyToastOutput,
            NotifyToastPassthrough,
            NotifyAudioOutput,
            NotifyAudioPassthrough,
        ]


async def comfy_entrypoint() -> MyExtension:
    return MyExtension()


import os

dir_name = os.path.dirname(os.path.abspath(__file__))
folder_name = os.path.basename(dir_name)
with open(f"{dir_name}/web/js/path.js", "w", encoding="utf-8") as f:
    f.write(
        f"const extension_base_path = '{folder_name}';\nexport{{ extension_base_path }};"
    )

WEB_DIRECTORY = "./web/"
