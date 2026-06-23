from PIL import Image

def remove_background(input_path, output_path, threshold=230):
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()
        newData = []
        for item in datas:
            # If the pixel is mostly white
            if item[0] > threshold and item[1] > threshold and item[2] > threshold:
                newData.append((255, 255, 255, 0)) # transparent
            else:
                newData.append(item)
        img.putdata(newData)
        # Crop the transparent borders
        img_bbox = img.getbbox()
        if img_bbox:
            img = img.crop(img_bbox)
        img.save(output_path, "PNG")
        print("Successfully created logo.png")
    except Exception as e:
        print("Error:", e)

remove_background(r"C:\Users\Vishal\.gemini\antigravity-ide\brain\aeaa95be-db9d-471d-910e-327233cdfead\user_images\1750715822.png", r"c:\Desktop\ApexQuant\public\logo.png")
