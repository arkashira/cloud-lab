   # 1. Global counter or database table
   MAX_CONCURRENT_LABS = 10

   # 2. Acquire a lock (threading.Lock or database transaction)
   with concurrent_labs_lock:
       current_labs = get_current_lab_count()   # query DB or in‑memory store
       if current_labs >= MAX_CONCURRENT_LABS:
           raise RuntimeError("Maximum concurrent labs reached")
       # reserve a slot
       reserve_lab_slot(user_id)

   # 3. Proceed with lab creation
   try:
       stack_manager.create_lab(user_id, lab_config)
   finally:
       # Release the slot regardless of success/failure
       release_lab_slot(user_id)