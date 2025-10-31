<div align="center">

# ComfyUI-AsyncPause
**A node pack for pausing execution asynchronously and notifying the user**
</div>

## Nodes
All the nodes are installed under the **`utils/`** category.

### `Pause`

The **`Pause`** node allows you to pause execution and resume it when desired by clicking the **`continue`** button.  

The node runs asynchronously, so when a **`Pause`** node is reached and begins waiting for user interaction, other nodes that don’t depend on it can continue executing.

<div align="center">
    <img src="https://github.com/vilanele/ComfyUI-AsyncPause/blob/main/assets/pause.png" alt="Pause node image" width="400">
</div>

**Options:**
- **`force_pause`** toggle — If enabled, forces execution of the node even if the inputs haven’t changed.  

- For convenience, it's possible to add a **`cancel`** button to the node to interrupt the current run 
(same as the **`cancel current run`** button in the top bar). This functionality can be enabled or disabled in the Settings (default: disabled).


**Example workflows:**
- Single pause node: [pause_single.json](https://github.com/vilanele/ComfyUI-AsyncPause/blob/main/workflows/pause/pause_single.json)
- Chained pause nodes: [pause_chained.json](https://github.com/vilanele/ComfyUI-AsyncPause/blob/main/workflows/pause/pause_chained.json)
- Parallel pause nodes: [pause_parallel.json](https://github.com/vilanele/ComfyUI-AsyncPause/blob/main/workflows/pause/pause_parallel.json)
- Chained + parallel pause nodes: [pause_chained_parallel.json](https://github.com/vilanele/ComfyUI-AsyncPause/blob/main/workflows/pause/pause_chained_parallel.json)

---

### `Notify Audio`

Triggers an audio notification when executed. Available as both an output node and a passthrough node.

<div align="center">
<table>
  <tr>
    <td align="center">
      <img src="https://github.com/vilanele/ComfyUI-AsyncPause/blob/main/assets/audio_output.png" width="400"/><br>
      <b>Output node</b>
    </td>
    <td align="center">
      <img src="https://github.com/vilanele/ComfyUI-AsyncPause/blob/main/assets/audio_passthrough.png" width="400"/><br>
      <b>Passthrough node</b>
    </td>
  </tr>
</table>
</div>

A preset collection of 12 notification sounds is included.

**To add a custom sound:**
1. Copy your sound file into the `web/audio` folder.  
2. Update the `sounds` object in `web/js/sounds.js` with the appropriate values.  
3. Restart ComfyUI to apply the changes. Your custom sound will now appear in the dropdown list of available sounds.


**Example workflows:**
- As an output node: [audio_output.json](https://github.com/vilanele/ComfyUI-AsyncPause/blob/main/workflows/notify/audio_output.json)
- As a passthrough node: [audio_passthrough.json](https://github.com/vilanele/ComfyUI-AsyncPause/blob/main/workflows/notify/audio_passthrough.json)


---

### `Notify Toast`

Triggers a [toast notification](https://docs.comfy.org/custom-nodes/js/javascript_toast) when executed. Available as both an output node and a passthrough node.

<div align="center">
<table>
  <tr>
    <td align="center">
      <img src="https://github.com/vilanele/ComfyUI-AsyncPause/blob/main/assets/toast_output.png" alt="Notify Toast Output node" width="400"><br>
      <b>Output node</b>
    </td>
    <td align="center">
      <img src="https://github.com/vilanele/ComfyUI-AsyncPause/blob/main/assets/toast_passthrough.png" alt="Notify Toast Passthrough node" width="400"><br>
      <b>Passthrough node</b>
    </td>
  </tr>
</table>
</div>



**Example workflows:**
- As an output node: [toast_output.json](https://github.com/vilanele/ComfyUI-AsyncPause/blob/main/workflows/notify/toast_output.json)
- As a passthrough node: [toast_passthrough.json](https://github.com/vilanele/ComfyUI-AsyncPause/blob/main/workflows/notify/toast_passthrough.json)

---

An example of a workflow combining the **`Pause`** node with notification nodes: [notify_and_pause.json](https://github.com/vilanele/ComfyUI-AsyncPause/blob/main/workflows/pause_and_notify.json)

## Subgraphs

A common pattern is to create a subgraph containing a notification node **before** and/or **after** a **`Pause`** node to get notified when **reaching** and/or **leaving** a checkpoint.

Example workflow using subgraphs: [pause_subgraphs.json](https://github.com/vilanele/ComfyUI-AsyncPause/blob/main/workflows/pause_subgraphs.json)




## Related Custom Nodes

- [ComfyUI-pause](https://github.com/wywywywy/ComfyUI-pause) includes a pause node, but it is not asynchronous and does not work properly with subgraphs.  

## To-Do
- Make the **`Pause`** node blink while waiting for user interaction.
- Support multiple dynamically added input and output connections.

## Support
If you like this node pack, consider supporting my work  with a coffee or a Bitcoin tip:

<a href='https://ko-fi.com/E1E81NL04T' target='_blank'><img height='36' style='display:block;border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi1.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

**`bc1qzje0h4k0u7jq80tm6xta2gtu80uhhuenmm6z5s`**
